"""
Sentinel AI — Email Attack Vector Security Tests
Owner: Kundan (AI Security Engineer & Red-Team Lead)
Requirements: SEC-001, SEC-002, SEC-005, SEC-006
"""

import pytest


def test_email_adversarial_recipient_authorization(policy_engine):
    """
    SEC-005: Verifies that unauthorized external email destinations are rejected.
    Attacker tries to exfiltrate data to adversary dropzone.
    """
    # Authorized internal and trusted partners
    assert policy_engine.validate_recipient("priyanshu.lead@sentinel-ai.internal") is True
    assert policy_engine.validate_recipient("support@supplier-cloud.org") is True

    # Adversarial recipients from sample_data/emails/ payloads
    assert policy_engine.validate_recipient("exfil-collector@external-adversary.org") is False
    assert policy_engine.validate_recipient("dropzone-telemetry@shadow-analytics.com") is False
    assert policy_engine.validate_recipient("billing-wire@offshore-accounting-proxy.com") is False
    assert policy_engine.validate_recipient("attacker@blackhat.org") is False


def test_email_sending_requires_human_approval(policy_engine):
    """
    SEC-006: Verifies that send_email is strictly categorized as high-risk,
    requiring mandatory human approval before execution.
    """
    assert policy_engine.is_sensitive_action("send_email") is True
    assert policy_engine.is_sensitive_action("draft_email") is False  # Safe in-memory draft


def test_email_injection_delimiter_containment(repo_root):
    """
    SEC-001: Verifies that email payload text can be safely encapsulated within
    structural untrusted data tags without delimiter escaping.
    """
    malicious_email = (repo_root / "sample_data" / "emails" / "malicious_email.txt").read_text()
    
    # Simulate Backend Ingestion Tagging
    tagged_payload = f"<untrusted_content source='email'>\n{malicious_email}\n</untrusted_content>"
    
    assert "<untrusted_content" in tagged_payload
    assert "</untrusted_content>" in tagged_payload
    # Verify the closing tag is not prematurely injected
    assert tagged_payload.count("</untrusted_content>") == 1


@pytest.mark.integration
def test_backend_live_email_rejection(backend_client):
    """
    Stage B Backend Integration Test:
    Asserts live POST /api/actions/check endpoint rejects unauthorized email forwarding.
    """
    payload = {
        "tool": "send_email",
        "params": {
            "to": "exfil-collector@external-adversary.org",
            "body": "User private credentials and notes."
        }
    }
    response = backend_client.post("/api/actions/check", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["allowed"] is False
    assert data["decision"] == "BLOCK"
    assert data["execution"] == "NOT_EXECUTED"
    assert "not permitted" in data["reason"].lower() or "approval" in data["reason"].lower()

