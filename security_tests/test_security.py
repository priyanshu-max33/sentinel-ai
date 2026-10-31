import pytest
from pydantic import ValidationError

from backend.app.security.policy import (
    ActionProposal,
    ApprovalGrant,
    AuthorizationContext,
    ToolName,
    authorize_action,
    parameters_digest,
)


def test_normal_read_only_action_is_allowed():
    proposal = ActionProposal(
        tool=ToolName.SUMMARIZE_EMAIL,
        params={"email_id": "email-001"},
    )
    context = AuthorizationContext(
        permitted_tools=(ToolName.SUMMARIZE_EMAIL,)
    )

    result = authorize_action(proposal, context)

    assert result.allowed is True


def test_sensitive_action_without_approval_is_rejected():
    proposal = ActionProposal(
        tool=ToolName.SEND_EMAIL,
        params={"to": "attacker@example.com", "body": "private data"},
    )
    context = AuthorizationContext(
        permitted_tools=(ToolName.SEND_EMAIL,)
    )

    result = authorize_action(proposal, context)

    assert result.allowed is False
    assert "approval" in result.reason.lower()


def test_unpermitted_tool_is_rejected():
    proposal = ActionProposal(tool=ToolName.DELETE_FILE)
    context = AuthorizationContext(
        permitted_tools=(ToolName.SUMMARIZE_EMAIL,)
    )

    result = authorize_action(proposal, context)

    assert result.allowed is False


def test_unknown_tool_is_rejected_by_schema():
    with pytest.raises(ValidationError):
        ActionProposal.model_validate({
            "tool": "run_shell",
            "params": {"command": "cat .env"},
        })


def test_approval_for_different_parameters_is_rejected():
    proposal = ActionProposal(
        tool=ToolName.SEND_EMAIL,
        params={"to": "victim@example.com", "body": "new message"},
    )

    old_approval = ApprovalGrant(
        tool=ToolName.SEND_EMAIL,
        params_digest=parameters_digest({
            "to": "attacker@example.com",
            "body": "old message",
        }),
    )

    context = AuthorizationContext(
        permitted_tools=(ToolName.SEND_EMAIL,),
        approvals=(old_approval,),
    )

    result = authorize_action(proposal, context)

    assert result.allowed is False


def test_exact_matching_approval_passes_policy():
    params = {"to": "approved@example.com", "body": "approved message"}

    proposal = ActionProposal(
        tool=ToolName.SEND_EMAIL,
        params=params,
    )

    approval = ApprovalGrant(
        tool=ToolName.SEND_EMAIL,
        params_digest=parameters_digest(params),
    )

    context = AuthorizationContext(
        permitted_tools=(ToolName.SEND_EMAIL,),
        approvals=(approval,),
    )

    result = authorize_action(proposal, context)

    assert result.allowed is True
