# Sentinel AI — Automated Security Test Suite

**Owner:** Kundan (AI Security Engineer & Red-Team Lead)  
**Track:** MSOT Halloween Hackathon — Track 3 (Prompt-Injection-Proof AI Agent)  

---

## 1. Overview & Architecture

This directory houses the complete automated security test suite for Sentinel AI. The tests are designed to run in two distinct stages:

### Stage A: Independent Security & Contract Tests
- Tests that run immediately without requiring a live backend or live Claude API keys.
- Validates:
  - Fixture & manifest integrity (`test_fixture_integrity.py`).
  - Parameter hashing and TOCTOU protection algorithms (`test_approval_bypass.py`).
  - Path canonicalization and sandbox containment (`test_tool_permissions.py`).
  - Tool allowlist and forbidden tool rejection (`test_tool_permissions.py`).
  - SSRF URL validation logic (`test_web_attacks.py`).
  - Recipient domain authorization rules (`test_email_attacks.py`).
  - Benign content keyword resilience (`test_benign_content.py`).
  - Credential scanning and output redaction (`test_credential_protection.py`).

### Stage B: Live Backend Integration Tests
- Real HTTP requests targeting Priyanshu's FastAPI backend (`http://localhost:8000`).
- Dynamically skipped with a clear pending notice if the backend server is not running.

---

## 2. Quick Start Commands

Activate the virtual environment:
```bash
source .venv/bin/activate
```

Run all independent Stage A tests:
```bash
pytest security_tests/ -v -m "not integration"
```

Run all tests including integration status:
```bash
pytest security_tests/ -v
```

Run the security test runner to generate metrics:
```bash
python security_tests/test_runner.py
```

