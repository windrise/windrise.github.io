# Safe single-paper review

A current repository writer posts one new comment with exactly `/approve 2611.09714v1`
(replace with the exact ID shown in that review). One comment approves one paper.
Leading/trailing whitespace is accepted by the parser; start the comment with `/approve `
for the workflow trigger. Bare `approve`, all/batch commands, edits and issue labels do
not approve anything. Leave unwanted papers unapproved. Approval does not close the
issue or remove other pending papers. Editing/deleting a comment does not undo a
committed approval. Labels are not per-paper rejection or starring controls.

## Frozen review data

Daily collection prepares canonical JSON under `data/papers/review-snapshots/`, named
by SHA-256, commits and pushes it, and only then publishes an issue referencing that
snapshot. Keep snapshots immutable. Missing/corrupt snapshots and unknown IDs fail
before any database write. No fallback to the latest `pending/` is permitted.

Issue #425 is migrated through `legacy-issues.json`, using all ten exact IDs, in order,
from `with_audio.json` at commit `6ba8d284f81767349b3ca6a738cf1f8ea9488d5c`.
The issue's old wording remains historical; use the new command after this change is
merged. Other historical reviews fail explicitly until their original data is recovered
from a verified historical commit and a reviewed manifest entry is added. Never map
an old review to today's pending files merely because some IDs overlap.

## Permissions, retry and verification

Only newly created comments on a `paper-review` issue trigger processing. PR comments
are excluded. GitHub checks the author's current write/maintain/admin permission
before checkout. Comment text is read as JSON data, never interpolated into shell code.
Only the selected paper is written, with version-independent arXiv deduplication.

Approval events do not share a concurrency group, so rapid comments are not discarded
by GitHub's single pending-run limit. Each run fetches the latest database; on a competing
push it recomputes the selected change and deduplicates, up to five attempts. Persistent
conflicts fail visibly and can be rerun safely. Daily collection alone is serialized.
No automatic database merge or force push is attempted. Check the run summary/commit;
no claim of deployment is made. Site deployment remains controlled by the existing
repository workflows.

Run offline regression checks: `python -m unittest discover -s tests -p 'test_paper_review.py' -v`.
Tests use temporary data and mocked issue reads; they never approve a live paper.
