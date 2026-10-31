"""
Sentinel AI — Security Test Configuration & Fixtures
Owner: Kundan (AI Security Engineer & Red-Team Lead)
"""

import json
import os
import hashlib
import urllib.parse
from pathlib import Path
import pytest

REPO_ROOT = Path(__file__).resolve().parent.parent
SAMPLE_DATA_DIR = REPO_ROOT / "sample_data"
MANIFEST_PATH = SAMPLE_DATA_DIR / "manifest.json"


@pytest.fixture(scope="session")
def repo_root():
    return REPO_ROOT


@pytest.fixture(scope="session")
def sample_data_dir():
    return SAMPLE_DATA_DIR


@pytest.fixture(scope="session")
def manifest():
    assert MANIFEST_PATH.exists(), f"Manifest file missing at {MANIFEST_PATH}"
    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


class PolicyEngineContract:
    """
    Formal reference implementation of the Sentinel AI Security Contract.
    Enforces requirements SEC-001 through SEC-015 independently of backend framework.
    Priyanshu will integrate these exact rules directly into the FastAPI Policy Engine.
    """

    ALLOWED_TOOLS = {
        "summarize_text",
        "extract_entities",
        "read_sample_file",
        "fetch_webpage",
        "draft_email",
        "send_email",
        "modify_file",
        "delete_file",
    }

    SENSITIVE_TOOLS = {
        "send_email",
        "modify_file",
        "delete_file",
    }

    TRUSTED_DOMAINS = {
        "sentinel-ai.internal",
        "collab-vendor.org",
        "supplier-cloud.org",
    }

    FORBIDDEN_IP_PREFIXES = (
        "127.",        # Loopback
        "10.",         # RFC 1918 Private
        "192.168.",    # RFC 1918 Private
        "172.16.",     # RFC 1918 Private
        "169.254.",    # Link-local / Cloud Metadata (AWS/GCP/Azure)
        "0.0.0.0",
        "localhost",
    )

    @classmethod
    def validate_tool_name(cls, tool_name: str) -> bool:
        """SEC-003 & SEC-004: Tool allowlist verification."""
        return tool_name in cls.ALLOWED_TOOLS

    @classmethod
    def is_sensitive_action(cls, tool_name: str) -> bool:
        """SEC-006: High-risk actions require human approval."""
        return tool_name in cls.SENSITIVE_TOOLS

    @classmethod
    def validate_recipient(cls, email_address: str) -> bool:
        """SEC-005: Destination authorization check."""
        if "@" not in email_address:
            return False
        domain = email_address.strip().split("@")[-1].lower()
        return domain in cls.TRUSTED_DOMAINS

    @classmethod
    def validate_sandbox_path(cls, path_str: str, sandbox_root: Path) -> bool:
        """SEC-011: Sandbox workspace containment and traversal prevention."""
        try:
            target_path = (sandbox_root / path_str).resolve()
            canonical_root = sandbox_root.resolve()
            return str(target_path).startswith(str(canonical_root))
        except Exception:
            return False

    @classmethod
    def compute_approval_digest(cls, tool_name: str, parameters: dict) -> str:
        """SEC-008: Deterministic SHA-256 parameter digest calculation."""
        canonical_json = json.dumps(parameters, sort_keys=True, separators=(",", ":"))
        digest_input = f"{tool_name}:{canonical_json}".encode("utf-8")
        return hashlib.sha256(digest_input).hexdigest()

    @classmethod
    def verify_approval_digest(cls, stored_digest: str, tool_name: str, parameters: dict) -> bool:
        """SEC-008: Verifies submitted parameters match the approved digest."""
        current_digest = cls.compute_approval_digest(tool_name, parameters)
        return current_digest == stored_digest

    @classmethod
    def validate_url_ssrf(cls, url_str: str) -> bool:
        """SEC-012: Prevents SSRF to internal network & cloud metadata services."""
        parsed = urllib.parse.urlparse(url_str)
        if parsed.scheme not in ("http", "https"):
            return False
        hostname = (parsed.hostname or "").lower()
        for prefix in cls.FORBIDDEN_IP_PREFIXES:
            if hostname.startswith(prefix) or hostname == prefix:
                return False
        return True

    @classmethod
    def scan_for_credentials(cls, text: str) -> bool:
        """SEC-009: Detects accidental exposure of secret keys in text output."""
        import re
        patterns = [
            r"sk-ant-[a-zA-Z0-9_\-]{20,}",  # Anthropic key pattern
            r"ghp_[a-zA-Z0-9]{30,}",        # GitHub PAT
            r"(?i)password\s*=\s*['\"][^'\"]+['\"]",
            r"(?i)api[_-]?key\s*=\s*['\"][^'\"]+['\"]",
        ]
        for p in patterns:
            if re.search(p, text):
                return True
        return False


@pytest.fixture
def policy_engine():
    return PolicyEngineContract


@pytest.fixture
def backend_client():
    """
    Stage B Fixture: Provides an in-memory FastAPI test client directly
    targeting Priyanshu's backend application.
    """
    from fastapi.testclient import TestClient
    from backend.app.main import app
    return TestClient(app)

