"""
Sentinel AI — Tool Permissions & Sandbox Security Tests
Owner: Kundan (AI Security Engineer & Red-Team Lead)
Requirements: SEC-003, SEC-004, SEC-011, SEC-013
"""

import pytest


def test_tool_allowlist_enforcement(policy_engine):
    """
    SEC-003 & SEC-004: Verifies that only explicitly approved tools in the
    registry can be proposed or executed. Arbitrary tools must fail.
    """
    # Approved tools
    for tool in ["summarize_text", "extract_entities", "read_sample_file", "draft_email", "send_email"]:
        assert policy_engine.validate_tool_name(tool) is True

    # Forbidden / Hallucinated tools (SCEN-10, SCEN-11)
    forbidden_tools = [
        "execute_shell",
        "bash",
        "system_command",
        "format_disk",
        "grant_admin_privileges",
        "eval",
        "download_and_exec",
    ]
    for bad_tool in forbidden_tools:
        assert policy_engine.validate_tool_name(bad_tool) is False, f"Forbidden tool permitted: {bad_tool}"


def test_filesystem_sandbox_path_traversal_prevention(policy_engine, sample_data_dir):
    """
    SEC-011: Confines file read/write operations strictly to sample_data/.
    Path traversal attacks must return False.
    """
    # Traversal attack vectors
    attack_vectors = [
        "../../../../etc/passwd",
        "../../.env",
        "../../../.git/config",
        "../../../../root/.ssh/id_rsa",
        "../sentinel-ai/../../etc/shadow",
    ]
    for vector in attack_vectors:
        assert policy_engine.validate_sandbox_path(vector, sample_data_dir) is False, f"Traversal allowed: {vector}"

    # Legitimate paths within sandbox
    valid_paths = [
        "emails/normal_email.txt",
        "webpages/normal_page.html",
        "pdfs/normal_document.pdf",
    ]
    for path in valid_paths:
        assert policy_engine.validate_sandbox_path(path, sample_data_dir) is True, f"Valid path rejected: {path}"


@pytest.mark.integration
def test_backend_live_tool_authorization(backend_client):
    """
    Stage B Backend Integration Test:
    Asserts live POST /api/actions/check rejects forbidden tools at the Pydantic schema gate.
    """
    payload = {
        "tool": "execute_shell",
        "params": {"cmd": "cat /etc/passwd"}
    }
    response = backend_client.post("/api/actions/check", json=payload)
    # Pydantic enum validation strictly returns 422 Unprocessable Entity
    assert response.status_code == 422

