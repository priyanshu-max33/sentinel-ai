# Sentinel AI — Security Threat Model

**Project:** Sentinel AI  
**Track:** AI Security / Prompt Injection  
**Status:** Initial threat model  
**Security principle:** The LLM proposes actions; the backend authorizes and executes them.

## 1. System overview

Sentinel AI processes user-provided emails, webpages and PDF documents.
An LLM may analyze this content and propose actions.

The LLM is not a trusted security boundary. All proposed actions must pass
independent backend validation and authorization before execution.

Initial prototype uses simulated tools. No real emails are sent and no
real user files are modified.

## 2. Assets to protect

| Asset | Security concern |
|---|---|
| User emails | Confidentiality and unauthorized forwarding |
| User documents and PDFs | Unauthorized reading, sharing or modification |
| User instructions | Must not be overridden by external content |
| API keys and credentials | Secret disclosure |
| Tool permissions | Unauthorized tool execution |
| Approval records | Must prove user authorization |
| Audit logs | Must preserve evidence of security events |
| Application data | Integrity and availability |

## 3. Attacker model

The attacker may be an external sender, website publisher, document author,
or anyone able to supply content processed by the agent.

Assume the attacker can:
- Send emails containing malicious instructions.
- Publish webpages containing visible or hidden instructions.
- Create PDFs containing malicious text.
- Attempt to override the user's original request.
- Try to make the agent disclose private information.
- Try to trigger unauthorized tools or bypass approval.

The attacker is not assumed to have direct access to the backend or database.

## 4. Untrusted input entry points

All externally supplied content is untrusted:

1. Email subject, body, attachments and quoted replies.
2. Webpage text, metadata and embedded content.
3. PDF text and extracted document content.
4. Tool output originating from external sources.

Instructions found inside these sources are data to analyze, not authority
to change system policy or user permissions.

## 5. Threat scenarios and potential impact

| Threat | Potential impact |
|---|---|
| Direct prompt injection | Agent ignores the user's request |
| Indirect prompt injection | External content manipulates agent behavior |
| Data exfiltration | Private information is disclosed |
| Unauthorized email action | Messages sent or forwarded without consent |
| File manipulation | Documents changed or deleted |
| Tool abuse | Unapproved capabilities are invoked |
| Approval bypass | Sensitive action executes without consent |
| Malicious URL | Unsafe network access or data exposure |
| Parser abuse | Malformed content affects document processing |
| Log leakage | Sensitive content appears in audit records |

## 6. Actions requiring authorization

The following actions must never execute solely because an LLM proposed them:

- Sending or forwarding an email.
- Sharing private information or attachments.
- Deleting or modifying user files.
- Accessing data outside the user's permitted scope.
- Changing account or security settings.
- Executing an unknown or unapproved tool.
- Making external network requests outside an approved policy.

Sensitive actions require explicit, action-specific user approval.
Approval must be checked by the backend, not inferred from model output.

## 7. If the LLM fails to detect an attack

We assume the LLM can be manipulated and may propose a dangerous action.

Example:
1. The user asks for an email summary.
2. The email contains instructions to forward private files.
3. The LLM proposes forwarding those files.
4. The backend receives the proposed action.
5. The backend checks the allowed tool, user intent, permissions,
   parameters and approval status.
6. If authorization is absent or invalid, the backend rejects the action.
7. The rejection is recorded in the audit log.

The system must remain safe even when the LLM completely misses the attack.

## 8. Independent backend security controls

The backend must enforce:

- Strict schemas for proposed actions.
- An allowlist of permitted tool names.
- Independent authorization checks.
- Action-specific approval for sensitive operations.
- Validation of recipients, paths and other action parameters.
- Denial by default when authorization is missing or invalid.
- No arbitrary shell execution.
- No unrestricted filesystem access.
- No secrets placed in prompts or untrusted content.
- Audit records for approvals, rejections and execution attempts.
- Simulated tools during the initial prototype.

The backend must never treat text from an email, webpage or PDF as user approval.

## 9. Security failure behavior

If validation, authorization or approval checks fail:
- Do not execute the proposed action.
- Return a clear rejection result.
- Record the event without unnecessarily storing sensitive content.
- Do not retry the action with weaker permissions.

If the authorization service or policy check is unavailable, fail closed.

## 10. Initial red-team test plan

The following tests must be implemented:

1. Malicious email asks the agent to forward private files.
2. Webpage asks the agent to ignore the user's original instructions.
3. PDF asks the agent to reveal secrets.
4. Email sending is proposed without approval.
5. Approval is missing, invalid or mismatched to the action.
6. An unknown tool is proposed.
7. Required action parameters are missing or malformed.
8. A normal, authorized low-risk task succeeds.

Expected result: unauthorized actions are rejected by the backend,
even if the LLM proposes them.

## 11. Residual risks and limitations

- Prompt injection cannot be guaranteed to be detected perfectly.
- LLM output may be incorrect or manipulated.
- Parsers may mishandle malformed documents.
- Incorrect authorization logic may introduce vulnerabilities.
- External services may have their own security risks.

This prototype demonstrates layered risk reduction, not perfect immunity
from prompt injection.

## 12. Security acceptance criteria

The security prototype is acceptable for demonstration when:

- Untrusted content is treated as data.
- The LLM cannot independently authorize actions.
- Unknown tools are rejected.
- Sensitive actions require valid user approval.
- Missing authorization causes rejection.
- Rejected actions are auditable.
- Automated tests demonstrate both legitimate success and attack rejection.
