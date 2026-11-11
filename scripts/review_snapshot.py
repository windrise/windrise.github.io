"""Immutable, content-addressed review batches and explicit single-paper commands."""
import hashlib
import json
import re
from pathlib import Path

SNAPSHOTS = Path("data/papers/review-snapshots")
ID = r"(?:[0-9]{4}\.[0-9]{4,5}|[a-z-]+(?:\.[A-Z]{2})?/[0-9]{7})(?:v[0-9]+)?"


def parse_approval(body):
    match = re.fullmatch(r"/approve (" + ID + r")", body.strip())
    if not match:
        raise ValueError("Use exactly /approve <arxiv-id>, one paper per new comment")
    return match.group(1)


def encode(papers):
    ids = [p.get("arxiv_id", "") for p in papers]
    if not ids or len(set(ids)) != len(ids) or any(not re.fullmatch(ID, i) for i in ids):
        raise ValueError("Snapshot must have unique, valid arXiv IDs")
    return json.dumps({"schema": 1, "papers": papers}, ensure_ascii=False,
                      sort_keys=True, separators=(",", ":")).encode("utf-8")


def save_snapshot(papers):
    raw = encode(papers)
    digest = hashlib.sha256(raw).hexdigest()
    SNAPSHOTS.mkdir(parents=True, exist_ok=True)
    path = SNAPSHOTS / (digest + ".json")
    if path.exists():
        if path.read_bytes() != raw:
            raise ValueError("Existing snapshot is corrupt; refusing overwrite")
    else:
        path.write_bytes(raw)
    return digest


def load_snapshot(body, issue_number=None):
    matches = re.findall(r"<!-- paper-review-snapshot: ([0-9a-f]{64}) -->", body)
    if not matches and issue_number is not None:
        manifest = SNAPSHOTS / "legacy-issues.json"
        if manifest.exists():
            entry = json.loads(manifest.read_text()).get(str(issue_number))
            if entry:
                matches = [entry["snapshot"]]
                if not re.fullmatch(r"[0-9a-f]{64}", matches[0]):
                    raise ValueError("Invalid legacy snapshot digest")
    if len(matches) != 1:
        raise ValueError("Missing/ambiguous snapshot. Legacy issues require verified historical migration; latest pending data is never used.")
    raw = (SNAPSHOTS / (matches[0] + ".json")).read_bytes()
    if hashlib.sha256(raw).hexdigest() != matches[0]:
        raise ValueError("Snapshot hash mismatch")
    data = json.loads(raw)
    if data.get("schema") != 1 or encode(data["papers"]) != raw:
        raise ValueError("Invalid snapshot")
    # Also bind migrated reviews to the exact visible paper list.
    if "paper-review-snapshot:" not in body:
        listed = re.findall(r"\*\*arXiv:\*\*\s*\[([^\]]+)\]", body)
        if listed != [p["arxiv_id"] for p in data["papers"]]:
            raise ValueError("Legacy issue no longer matches its verified snapshot")
    return data["papers"]
