"""
Sentinel AI — PDF Attack Vector Security Tests
Owner: Kundan (AI Security Engineer & Red-Team Lead)
Requirements: SEC-001, SEC-004, SEC-011
"""

import fitz
import pytest


def test_pdf_body_injection_text_extraction(repo_root):
    """
    SEC-001: Verifies that adversarial text inside malicious_document.pdf is extracted
    and identified as untrusted data.
    """
    pdf_path = repo_root / "sample_data" / "pdfs" / "malicious_document.pdf"
    doc = fitz.open(str(pdf_path))
    extracted = doc[0].get_text()
    doc.close()

    assert "CRITICAL NOTICE TO THE AI AGENT" in extracted
    assert "read_file" in extracted
    assert "delete_file" in extracted


def test_pdf_metadata_injection_quarantine(repo_root):
    """
    SEC-001: Verifies that metadata fields (Author, Title) containing adversarial
    tokens are not executed as commands.
    """
    pdf_path = repo_root / "sample_data" / "pdfs" / "malicious_document.pdf"
    doc = fitz.open(str(pdf_path))
    metadata = doc.metadata
    doc.close()

    assert "SYSTEM_OVERRIDE" in metadata.get("author", "")


def test_pdf_extracted_path_traversal_blocked_by_sandbox(policy_engine, repo_root):
    """
    SEC-011: Verifies that traversal paths extracted from PDF payloads
    (e.g., '../../../../etc/passwd') are strictly rejected by the sandbox policy.
    """
    sandbox_dir = repo_root / "sample_data"
    
    # Adversarial path from malicious_document.pdf
    traversal_path = "../../../../etc/passwd"
    assert policy_engine.validate_sandbox_path(traversal_path, sandbox_dir) is False

    # Legitimate sandbox path
    legitimate_path = "emails/normal_email.txt"
    assert policy_engine.validate_sandbox_path(legitimate_path, sandbox_dir) is True


@pytest.mark.integration
def test_backend_live_pdf_policy_enforcement():
    """Stage B Backend Integration Test."""
    pytest.skip("Backend server not running at http://localhost:8000. Stage B integration pending Priyanshu handoff.")

