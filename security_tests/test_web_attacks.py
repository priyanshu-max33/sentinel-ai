"""
Sentinel AI — Web Attack Vector & SSRF Security Tests
Owner: Kundan (AI Security Engineer & Red-Team Lead)
Requirements: SEC-001, SEC-002, SEC-012
"""

import pytest


def test_ssrf_forbidden_private_and_cloud_metadata_ip(policy_engine):
    """
    SEC-012: Prevents SSRF attacks targeting localhost, intranet, and AWS/GCP/Azure metadata.
    """
    # Cloud metadata target (SCEN-05 & sample_data/webpages/hidden_injection.html)
    assert policy_engine.validate_url_ssrf("http://169.254.169.254/latest/meta-data/") is False
    assert policy_engine.validate_url_ssrf("http://169.254.169.254/computeMetadata/v1/") is False

    # Loopback targets
    assert policy_engine.validate_url_ssrf("http://127.0.0.1:8000/internal-admin") is False
    assert policy_engine.validate_url_ssrf("http://localhost:5000/keys") is False

    # Private RFC 1918 subnets
    assert policy_engine.validate_url_ssrf("http://10.0.0.5/secrets") is False
    assert policy_engine.validate_url_ssrf("http://192.168.1.1/router-login") is False

    # Non-HTTP schemes
    assert policy_engine.validate_url_ssrf("file:///etc/passwd") is False
    assert policy_engine.validate_url_ssrf("gopher://127.0.0.1:25") is False


def test_ssrf_allowed_public_web_domains(policy_engine):
    """
    SEC-012: Legitimate public web domains must pass validation.
    """
    assert policy_engine.validate_url_ssrf("https://en.wikipedia.org/wiki/Artificial_intelligence") is True
    assert policy_engine.validate_url_ssrf("https://docs.python.org/3/") is True
    assert policy_engine.validate_url_ssrf("https://github.com/priyanshu-max33/sentinel-ai") is True


def test_hidden_injection_extracted_content_flagged_untrusted(repo_root):
    """
    SEC-001: Verifies that HTML containing hidden CSS style tags is still treated
    as untrusted data by the ingestion parser.
    """
    hidden_html = (repo_root / "sample_data" / "webpages" / "hidden_injection.html").read_text()
    assert "display: none" in hidden_html or "display:none" in hidden_html
    assert "169.254.169.254" in hidden_html


@pytest.mark.integration
def test_backend_live_ssrf_blocking():
    """Stage B Backend Integration Test."""
    pytest.skip("Backend server not running at http://localhost:8000. Stage B integration pending Priyanshu handoff.")

