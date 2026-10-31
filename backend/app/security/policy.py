
"""Backend authorization boundary for Sentinel AI."""

import hashlib
import json
from enum import Enum
from typing import Any, Tuple

from pydantic import BaseModel, ConfigDict, Field


class ToolName(str, Enum):
    SUMMARIZE_EMAIL = "summarize_email"
    SEARCH_EMAIL = "search_email"
    SEND_EMAIL = "send_email"
    FORWARD_EMAIL = "forward_email"
    MODIFY_FILE = "modify_file"
    DELETE_FILE = "delete_file"


SENSITIVE_TOOLS = {
    ToolName.SEND_EMAIL,
    ToolName.FORWARD_EMAIL,
    ToolName.MODIFY_FILE,
    ToolName.DELETE_FILE,
}


class ActionProposal(BaseModel):
    """Untrusted action proposal produced by the agent."""

    model_config = ConfigDict(extra="forbid")

    tool: ToolName
    params: dict[str, Any] = Field(default_factory=dict)


class ApprovalGrant(BaseModel):
    """Approval record created by the backend."""

    model_config = ConfigDict(extra="forbid", strict=True)

    tool: ToolName
    params_digest: str


class AuthorizationContext(BaseModel):
    """Construct only from trusted backend/session data."""

    model_config = ConfigDict(extra="forbid", strict=True)

    permitted_tools: Tuple[ToolName, ...] = ()
    approvals: Tuple[ApprovalGrant, ...] = ()


class PolicyDecision(BaseModel):
    allowed: bool
    reason: str


def parameters_digest(params: dict[str, Any]) -> str:
    """Create a stable fingerprint of action parameters."""

    serialized = json.dumps(
        params,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=True,
    )

    return hashlib.sha256(
        serialized.encode("utf-8")
    ).hexdigest()


def authorize_action(
    proposal: ActionProposal,
    context: AuthorizationContext,
) -> PolicyDecision:
    """Authorize a proposal without executing it."""

    # Reject tools not permitted by the trusted backend.
    if proposal.tool not in context.permitted_tools:
        return PolicyDecision(
            allowed=False,
            reason="Tool is not permitted for this user session.",
        )

    # Sensitive actions require approval for exact parameters.
    if proposal.tool in SENSITIVE_TOOLS:
        try:
            digest = parameters_digest(proposal.params)
        except (TypeError, ValueError):
            return PolicyDecision(
                allowed=False,
                reason="Invalid action parameters.",
            )

        matching_approval = any(
            grant.tool == proposal.tool
            and grant.params_digest == digest
            for grant in context.approvals
        )

        if not matching_approval:
            return PolicyDecision(
                allowed=False,
                reason="Explicit approval for this exact action is required.",
            )

    return PolicyDecision(
        allowed=True,
        reason="Action passed backend authorization.",
    )
