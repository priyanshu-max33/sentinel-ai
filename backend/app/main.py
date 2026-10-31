from fastapi import FastAPI
from pydantic import ValidationError

from backend.app.security.policy import (
    ActionProposal,
    AuthorizationContext,
    ToolName,
    authorize_action,
)

app = FastAPI(
    title="Sentinel AI",
    description="Prompt Injection Security Demonstration",
    version="1.0.0",
)


@app.get("/health")
def health():
    return {
        "status": "online",
        "project": "Sentinel AI"
    }


@app.post("/api/actions/check")
def check_action(proposal: ActionProposal):
    # Demo permissions are controlled by the backend.
    # They are never accepted from the AI proposal.
    context = AuthorizationContext(
        permitted_tools=(ToolName.SUMMARIZE_EMAIL,)
    )

    decision = authorize_action(proposal, context)

    return {
        "tool": proposal.tool.value,
        "allowed": decision.allowed,
        "decision": "ALLOW" if decision.allowed else "BLOCK",
        "reason": decision.reason,
        "execution": "NOT_EXECUTED"
    }