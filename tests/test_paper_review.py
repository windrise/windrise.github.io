import json
import os
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import review_snapshot as snapshot
import process_approved_papers as process
import create_review_issue as create

class ReviewTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.old = os.getcwd()
        os.chdir(self.temp.name)
        self.papers = [{'arxiv_id': '2611.12345v1', 'title': 'A'},
                       {'arxiv_id': '2611.23456v1', 'title': 'B'}]
        digest = snapshot.save_snapshot(self.papers)
        self.body = f'<!-- paper-review-snapshot: {digest} -->'
        self.digest = digest
    def tearDown(self):
        os.chdir(self.old)
        self.temp.cleanup()
    def test_explicit_command(self):
        self.assertEqual(snapshot.parse_approval('/approve 2611.12345v1'), '2611.12345v1')
        for bad in ['approve', '/approve all', '/approve 2611.12345v1 2611.23456v1',
                    '/approve 2611.12345v1\n/approve 2611.23456v1', '> /approve 2611.12345v1']:
            with self.assertRaises(ValueError): snapshot.parse_approval(bad)
    def test_frozen_across_batches(self):
        snapshot.save_snapshot([{'arxiv_id':'2611.99999', 'title':'Later'}])
        self.assertEqual(snapshot.load_snapshot(self.body), self.papers)
    def test_missing_legacy_ambiguous_and_corrupt(self):
        for body in ['old review', self.body + self.body]:
            with self.assertRaises(ValueError): snapshot.load_snapshot(body)
        (snapshot.SNAPSHOTS / (self.digest + '.json')).write_text('{}')
        with self.assertRaises(ValueError): snapshot.load_snapshot(self.body)
    def test_single_paper_and_idempotent(self):
        with patch.object(process, 'get_issue_content', return_value=self.body):
            process.process_approved_papers(425, '/approve 2611.12345v1')
            process.process_approved_papers(425, '/approve 2611.12345v1')
        papers = process.load_papers_yaml()['papers']
        self.assertEqual([p['arxiv_id'] for p in papers], ['2611.12345v1'])
    def test_unknown_fails_without_write(self):
        with patch.object(process, 'get_issue_content', return_value=self.body):
            with self.assertRaises(ValueError): process.process_approved_papers(425, '/approve 2611.99999')
        self.assertFalse(Path('data/papers/papers.yaml').exists())
    def test_version_deduplication(self):
        process.save_papers_yaml({'papers':[{'arxiv_id':'2611.12345v2'}]})
        with patch.object(process, 'get_issue_content', return_value=self.body):
            process.process_approved_papers(425, '/approve 2611.12345v1')
        self.assertEqual(len(process.load_papers_yaml()['papers']), 1)
    def test_template_and_prepare_no_external_calls(self):
        body = create.create_issue_body(self.papers)
        self.assertIn('/approve 2611.12345v1', body)
        self.assertNotIn('Add label `approved`', body)
        with patch.object(create.subprocess, 'run') as run:
            create.create_issue(self.papers, prepare_only=True)
            run.assert_not_called()
    def test_legacy_manifest_and_visible_binding(self):
        (snapshot.SNAPSHOTS / 'legacy-issues.json').write_text(json.dumps({'425': {'snapshot': self.digest}}))
        body = '\n'.join('**arXiv:** [' + p['arxiv_id'] + '](url)' for p in self.papers)
        self.assertEqual(snapshot.load_snapshot(body, 425), self.papers)
        with self.assertRaises(ValueError): snapshot.load_snapshot(body, 426)
        with self.assertRaises(ValueError): snapshot.load_snapshot(body + '\n**arXiv:** [2611.99999](url)', 425)
    def test_publish_requires_committed_snapshot(self):
        with patch.object(create.subprocess, 'run', return_value=type('Result', (), {'stdout': b'wrong'})()) as run:
            with self.assertRaises(ValueError): create.create_issue(self.papers)
            self.assertEqual(run.call_count, 1)
    def test_workflow_security_guards(self):
        root = Path(__file__).resolve().parents[1]
        flow = (root / '.github/workflows/process-approved-papers.yml').read_text()
        self.assertIn('getCollaboratorPermissionLevel', flow)
        self.assertIn("['admin', 'maintain', 'write']", flow)
        self.assertNotIn('types: [labeled]', flow)
        self.assertNotIn('${{ github.event.comment.body }}', flow)
        self.assertIn('git add data/papers/papers.yaml', flow)
    def test_duplicate_snapshot_ids_rejected(self):
        with self.assertRaises(ValueError): snapshot.save_snapshot(self.papers * 2)

if __name__ == '__main__': unittest.main()
