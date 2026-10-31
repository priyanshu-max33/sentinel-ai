"""
Sentinel AI — Fixture & Manifest Integrity Tests (Tier 1)
Owner: Kundan (AI Security Engineer & Red-Team Lead)
Requirement: Pre-Flight Test Environment Validation
"""

import json
from pathlib import Path
import fitz  # PyMuPDF


def test_manifest_schema_and_uniqueness(manifest):
    """Verifies manifest.json format, count, and unique sample IDs."""
    assert manifest.get("version") == "1.0"
    assert manifest.get("project") == "Sentinel AI"
    samples = manifest.get("samples", [])
    assert len(samples) == 14, f"Expected 14 samples, got {len(samples)}"

    sample_ids = [s["sample_id"] for s in samples]
    assert len(sample_ids) == len(set(sample_ids)), "Duplicate sample_id detected in manifest!"


def test_all_manifest_files_exist_and_non_empty(repo_root, manifest):
    """Verifies that every single file declared in the manifest exists on disk and is non-empty."""
    for item in manifest["samples"]:
        full_path = repo_root / item["file_path"]
        assert full_path.exists(), f"Sample file missing: {full_path}"
        assert full_path.is_file(), f"Sample path is not a file: {full_path}"
        assert full_path.stat().st_size > 0, f"Sample file is empty (0 bytes): {full_path}"


def test_pdf_fixtures_render_and_extract_text(repo_root):
    """Verifies that generated PDF documents can be opened and text extracted."""
    pdf_dir = repo_root / "sample_data" / "pdfs"
    normal_pdf = pdf_dir / "normal_document.pdf"
    malicious_pdf = pdf_dir / "malicious_document.pdf"

    for pdf_path in [normal_pdf, malicious_pdf]:
        assert pdf_path.exists(), f"PDF missing: {pdf_path}"
        doc = fitz.open(str(pdf_path))
        assert len(doc) >= 1, f"PDF has 0 pages: {pdf_path}"
        text = doc[0].get_text()
        assert len(text.strip()) > 50, f"Extracted text too short in: {pdf_path}"
        doc.close()


def test_html_fixtures_contain_valid_structure(repo_root):
    """Verifies that HTML fixtures contain valid DOCTYPE, html, and body tags."""
    web_dir = repo_root / "sample_data" / "webpages"
    for html_file in web_dir.glob("*.html"):
        content = html_file.read_text(encoding="utf-8")
        assert "<!DOCTYPE html>" in content or "<html" in content
        assert "</body>" in content
        assert "</html>" in content

