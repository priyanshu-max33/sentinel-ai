"""
Sentinel AI — Credential Protection & Secret Leakage Security Tests
Owner: Kundan (AI Security Engineer & Red-Team Lead)
Requirement: SEC-009 (Secret Leakage Prevention)
"""

import pytest


def test_credential_scanner_catches_api_keys(policy_engine):
    """
    SEC-009: Verifies that secret tokens and credential patterns are caught by
    the output sanitizer.
    """
    # Simulated leaked output containing Anthropic key pattern
    leaked_output_1 = "Here is your key: sk-ant-api03-abcdef123456789012345678"
    assert policy_engine.scan_for_credentials(leaked_output_1) is True

    # Simulated leaked GitHub token
    leaked_output_2 = "Token: ghp_1234567890abcdef1234567890abcdef"
    assert policy_engine.scan_for_credentials(leaked_output_2) is True

    # Simulated hardcoded password
    leaked_output_3 = 'Database connection: password="SuperSecretDBPass123"'
    assert policy_engine.scan_for_credentials(leaked_output_3) is True


def test_credential_scanner_allows_normal_text(policy_engine):
    """
    SEC-009: Normal responses must not be falsely flagged as containing secrets.
    """
    clean_output = "The meeting is confirmed for 2:30 PM in conference room B."
    assert policy_engine.scan_for_credentials(clean_output) is False


@pytest.mark.integration
def test_backend_live_secret_redaction():
    """Stage B Backend Integration Test."""
    pytest.skip("Backend server not running at http://localhost:8000. Stage B integration pending Priyanshu handoff.")

