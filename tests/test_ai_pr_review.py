"""Offline behavioral checks; run with python3 -m unittest discover -s tests -p 'test_*.py'."""

from contextlib import redirect_stdout
from datetime import datetime, timedelta, timezone
from email.utils import format_datetime
from http.client import IncompleteRead
from io import BytesIO, StringIO
import json
import unittest
from unittest.mock import Mock
from urllib.error import HTTPError, URLError

from scripts import ai_pr_review as review


SHA = "a" * 40
ENV = {"GITHUB_TOKEN": "github-secret-test", "GITHUB_REPOSITORY": "windrise/example",
       "PR_NUMBER": "42", "AMD_API_KEY": "amd-secret-test"}
PR = {"head": {"sha": SHA}, "state": "open", "title": "Fix handler", "changed_files": 1}
FILE = {"filename": "app.py", "status": "modified", "patch": "@@ -1 +1 @@\n-old\n+new",
        "additions": 1, "deletions": 1}


def response(content="在本次提供的差异范围内未发现明确缺陷", **message_fields):
    return {"choices": [{"finish_reason": "stop", "message": {"content": content, **message_fields}}]}


def event(content=None, finish=None, **delta):
    return {"choices": [{"index": 0, "delta": {"content": content, **delta}, "finish_reason": finish}]}


def sse(*events, done=True):
    body = b"".join(b"data: " + json.dumps(value, ensure_ascii=False).encode() + b"\n\n"
                    for value in events)
    return body + (b"data: [DONE]\n\n" if done else b"")


class FakeOpener:
    def __init__(self, *results):
        self.results = list(results)
        self.requests = []

    def open(self, request, timeout):
        self.requests.append((request, timeout))
        result = self.results.pop(0)
        if isinstance(result, Exception):
            raise result
        if hasattr(result, "read"):
            return result
        return BytesIO(result if isinstance(result, bytes) else json.dumps(result).encode())


def http_error(status, retry_after="", body=b"private error body"):
    return HTTPError("https://example.invalid", status, "private message", {"Retry-After": retry_after},
                     BytesIO(body))


class ConfigurationTests(unittest.TestCase):
    def test_required_environment_is_validated_without_value_leakage(self):
        for name in ENV:
            env = dict(ENV)
            del env[name]
            with self.subTest(name=name), self.assertRaisesRegex(review.ReviewError, name):
                review.Config.from_env(env)
        for name, value in (("PR_NUMBER", "invalid-private-value"),
                            ("GITHUB_REPOSITORY", "private-value?x=y"),
                            ("AMD_BASE_URL", "https://private-value.example/api")):
            with self.subTest(name=name), self.assertRaises(review.ReviewError) as caught:
                review.Config.from_env({**ENV, name: value})
            self.assertNotIn(value, str(caught.exception))

    def test_default_model_and_bounded_context(self):
        config = review.Config.from_env({**ENV, "ADDITIONAL_CONTEXT": "x" * 3000})
        self.assertEqual(config.model, "DeepSeek-V4.1-Flash")
        self.assertEqual(config.base_url, review.AMD_BASE_URL)
        self.assertEqual(len(config.additional_context), 2000)


class TransportTests(unittest.TestCase):
    def test_amd_auth_payload_fixed_url_and_timeout(self):
        opener = FakeOpener(sse(event("审查结论", "stop")))
        api = review.JsonAPI(review.AMD_BASE_URL, ENV["AMD_API_KEY"], opener=opener)
        config = review.Config.from_env(ENV)
        review.model_review(api, config, "diff text")
        request, timeout = opener.requests[0]
        self.assertEqual(request.full_url, review.AMD_BASE_URL + "/chat/completions")
        self.assertEqual(request.get_header("Authorization"), "Bearer " + ENV["AMD_API_KEY"])
        self.assertEqual(timeout, 600)
        self.assertEqual(request.get_header("Accept"), "text/event-stream")
        payload = json.loads(request.data)
        self.assertEqual(payload["max_tokens"], 2000)
        self.assertTrue(payload["stream"])
        self.assertEqual(payload["model"], config.model)
        self.assertEqual(payload["messages"][1], {"role": "user", "content": "diff text"})
        self.assertNotIn("tools", payload)
        self.assertNotIn(ENV["GITHUB_TOKEN"], request.data.decode())

    def test_github_auth_and_api_version(self):
        opener = FakeOpener({})
        api = review.JsonAPI(review.GITHUB_ORIGIN, ENV["GITHUB_TOKEN"], github=True, opener=opener)
        api.request("GET", "/repos/windrise/example")
        request = opener.requests[0][0]
        self.assertEqual(request.get_header("Authorization"), "Bearer " + ENV["GITHUB_TOKEN"])
        self.assertEqual(request.get_header("X-github-api-version"), "2022-11-28")
        self.assertEqual(opener.requests[0][1], 30)

    def test_slow_retryable_error_reduces_next_timeout_to_remaining_budget(self):
        clock = Mock(return_value=0)
        opener = FakeOpener(http_error(503), {"ok": True})
        original_open = opener.open

        def slow_open(request, timeout):
            clock.return_value += 599 if not opener.requests else 1
            return original_open(request, timeout)

        def sleep(seconds):
            clock.return_value += seconds

        opener.open = slow_open
        api = review.JsonAPI(review.AMD_BASE_URL, "token", opener=opener,
                             sleep=sleep, monotonic=clock)
        self.assertEqual(api.request("POST", "/chat/completions", {}), {"ok": True})
        self.assertEqual([timeout for _, timeout in opener.requests], [600, 59])

    def test_retry_stops_when_backoff_would_exhaust_remaining_budget(self):
        clock = Mock(return_value=0)
        opener = FakeOpener(http_error(503), http_error(503), {})
        original_open = opener.open
        delays = []

        def slow_open(request, timeout):
            clock.return_value += 599 if not opener.requests else 56
            return original_open(request, timeout)

        def sleep(seconds):
            delays.append(seconds)
            clock.return_value += seconds

        opener.open = slow_open
        api = review.JsonAPI(review.AMD_BASE_URL, "token", opener=opener,
                             sleep=sleep, monotonic=clock)
        with self.assertRaisesRegex(review.ReviewError, "total retry time budget"):
            api.request("POST", "/chat/completions", {})
        self.assertEqual(len(opener.requests), 2)
        self.assertEqual(delays, [2])

    def test_timeouts_are_identified_without_leaking_exception_details_or_retrying(self):
        for error in (TimeoutError("private-timeout-details"),
                      URLError(TimeoutError("private-timeout-details"))):
            for github in (False, True):
                opener = FakeOpener(error)
                origin = review.GITHUB_ORIGIN if github else review.AMD_BASE_URL
                api = review.JsonAPI(origin, "token", github=github, opener=opener)
                with self.subTest(github=github), self.assertRaises(review.ReviewError) as caught:
                    api.request("POST", "/reviews" if github else "/chat/completions", {})
                self.assertIn("timed out", str(caught.exception))
                self.assertIn("30s" if github else "600s", str(caught.exception))
                self.assertIn("attempt 1/1" if github else "attempt 1/3", str(caught.exception))
                self.assertNotIn("private", str(caught.exception))
                self.assertEqual(len(opener.requests), 1)

    def test_retry_limits_and_capped_retry_after(self):
        opener = FakeOpener(http_error(429, "20"), http_error(503, "2"), {"ok": True})
        sleep = Mock()
        api = review.JsonAPI(review.AMD_BASE_URL, "token", opener=opener, sleep=sleep)
        self.assertEqual(api.request("POST", "/chat/completions", {}), {"ok": True})
        self.assertEqual([call.args[0] for call in sleep.call_args_list], [20, 4])
        self.assertEqual(len(opener.requests), 3)
        future = format_datetime(datetime.now(timezone.utc) + timedelta(hours=1))
        self.assertIsNone(review.retry_delay(future, 0))

    def test_long_server_delay_stops_instead_of_retrying_too_early(self):
        opener = FakeOpener(http_error(429, "99999"), {})
        sleep = Mock()
        api = review.JsonAPI(review.AMD_BASE_URL, "token", opener=opener, sleep=sleep)
        with self.assertRaisesRegex(review.ReviewError, "retry budget"):
            api.request("POST", "/chat/completions", {})
        sleep.assert_not_called()
        self.assertEqual(len(opener.requests), 1)

    def test_final_http_error_is_sanitized_and_stops_after_three_calls(self):
        opener = FakeOpener(*(http_error(429, body=ENV["AMD_API_KEY"].encode()) for _ in range(4)))
        api = review.JsonAPI(review.AMD_BASE_URL, ENV["AMD_API_KEY"], opener=opener, sleep=Mock())
        with self.assertRaisesRegex(review.ReviewError, "HTTP 429") as caught:
            api.request("POST", "/chat/completions", {})
        self.assertNotIn(ENV["AMD_API_KEY"], str(caught.exception))
        self.assertNotIn("private", str(caught.exception))
        self.assertEqual(len(opener.requests), 3)

    def test_nonretryable_errors_do_not_expose_error_details(self):
        for error in (http_error(401), http_error(302), URLError("secret-host-private")):
            opener = FakeOpener(error)
            api = review.JsonAPI(review.AMD_BASE_URL, "token", opener=opener)
            with self.subTest(error=type(error)), self.assertRaises(review.ReviewError) as caught:
                api.request("POST", "/chat/completions", {})
            self.assertNotIn("private", str(caught.exception))
            self.assertEqual(len(opener.requests), 1)

    def test_redirect_handler_and_foreign_origins_are_blocked(self):
        self.assertIsNone(review.NoRedirect().redirect_request(None, None, 302, "", {}, "https://evil"))
        opener = FakeOpener({})
        api = review.JsonAPI("https://evil.example", "secret", opener=opener)
        with self.assertRaisesRegex(review.ReviewError, "allowed HTTPS origin"):
            api.request("POST", "/chat/completions", {})
        self.assertEqual(opener.requests, [])

    def test_post_is_not_retried_after_ambiguous_failure(self):
        opener = FakeOpener(http_error(503), {})
        api = review.JsonAPI(review.GITHUB_ORIGIN, "token", github=True, opener=opener)
        with self.assertRaises(review.ReviewError):
            api.request("POST", "/repos/owner/repo/pulls/1/reviews", {})
        self.assertEqual(len(opener.requests), 1)

    def test_invalid_json_and_oversized_responses_are_rejected(self):
        for raw in (b"invalid-json-private", b"x" * (review.MAX_RESPONSE_BYTES + 1)):
            api = review.JsonAPI(review.AMD_BASE_URL, "token", opener=FakeOpener(raw))
            with self.subTest(size=len(raw)), self.assertRaises(review.ReviewError) as caught:
                api.request("POST", "/chat/completions", {})
            self.assertNotIn("private", str(caught.exception))


class StreamingTests(unittest.TestCase):
    def request(self, body, **kwargs):
        self.opener = FakeOpener(body)
        api = review.JsonAPI(review.AMD_BASE_URL, "token", opener=self.opener, **kwargs)
        return api.request("POST", "/chat/completions", {"stream": True})

    def test_deltas_reasoning_usage_keepalives_and_multiline_events(self):
        body = b": keepalive\n\n"
        body += sse(event("检查", reasoning="private", reasoning_content="private"), done=False)
        body += b'data: {"choices": [\ndata: {"delta": {"content": " complete"}, "finish_reason": "stop"}]}\n\n'
        body += sse({"choices": [], "usage": {"completion_tokens": 3}})
        result = self.request(body)
        self.assertEqual(result["choices"][0]["message"]["content"], "检查 complete")
        self.assertEqual(result["choices"][0]["finish_reason"], "stop")
        self.assertNotIn("private", json.dumps(result))

    def test_missing_terminal_or_successful_finish_is_rejected(self):
        bodies = [sse(event("partial", "stop"), done=False), sse(event("partial")),
                  sse(event("partial", "length")), sse(event("partial", "tool_calls"))]
        for body in bodies:
            with self.subTest(body_size=len(body)), self.assertRaises(review.ReviewError):
                self.request(body)
            self.assertEqual(len(self.opener.requests), 1)

    def test_invalid_error_and_oversized_events_are_sanitized(self):
        bodies = [b"data: private-invalid-json\n\n", sse({"error": {"message": "private"}}),
                  sse({"choices": ["private-invalid-choice"]}),
                  sse(event("x" * (review.MAX_OUTPUT_CHARS + 1), "stop")),
                  b":" + b"x" * 65_536 + b"\n",
                  (b":" + b"x" * 999 + b"\n") * 4000]
        for body in bodies:
            with self.subTest(body_size=len(body)), self.assertRaises(review.ReviewError) as caught:
                self.request(body)
            self.assertNotIn("private", str(caught.exception))
            self.assertEqual(len(self.opener.requests), 1)

    def test_interrupted_stream_is_not_retried_after_partial_text(self):
        class InterruptedStream(BytesIO):
            def readline(self, size=-1):
                line = super().readline(size)
                if not line:
                    raise self.error
                return line

        for error in (TimeoutError("private transport details"),
                      IncompleteRead(b"private partial bytes"), http_error(503)):
            body = InterruptedStream(sse(event("partial"), done=False))
            body.error = error
            with self.subTest(error_type=type(error)), self.assertRaises(review.ReviewError) as caught:
                self.request(body)
            self.assertNotIn("private", str(caught.exception))
            self.assertEqual(len(self.opener.requests), 1)

    def test_stream_deadline_stops_without_postable_partial_content(self):
        clock = Mock(return_value=0)

        class SlowStream(BytesIO):
            def readline(self, size=-1):
                clock.return_value = 661
                return super().readline(size)

        with self.assertRaisesRegex(review.ReviewError, "total retry time budget"):
            self.request(SlowStream(sse(event("partial", "stop"))), monotonic=clock)
        self.assertEqual(len(self.opener.requests), 1)


class ScopeTests(unittest.TestCase):
    def test_deterministic_truncation_and_disclosed_missing_scope(self):
        files = [{**FILE, "filename": "a.py", "patch": "+line\n" * 20_000},
                 {**FILE, "filename": "z.py"}, {"filename": "binary.png", "status": "added"}]
        pr = {**PR, "changed_files": 5}
        prompt, scope, has_diff = review.build_prompt(pr, files)
        self.assertTrue(has_diff)
        self.assertLessEqual(len(prompt) + len(review.SYSTEM_PROMPT), review.MAX_PROMPT_CHARS)
        self.assertEqual(review.build_prompt(pr, list(reversed(files)))[0], prompt)
        for expected in ("因输入预算截断", "a.py", "因输入预算省略", "z.py",
                         "没有可用文本差异", "binary.png", "2 个文件未取得", "不能视为完整代码审查"):
            self.assertIn(expected, scope)

    def test_upstream_partial_patch_is_reported(self):
        _, scope, _ = review.build_prompt(PR, [{**FILE, "additions": 999}])
        self.assertIn("GitHub 返回的差异少于变更行数", scope)

    def test_no_patches_has_explicit_no_review_scope(self):
        _, scope, has_diff = review.build_prompt(PR, [{"filename": "binary.png"}])
        self.assertFalse(has_diff)
        self.assertIn("未调用模型", scope)
        self.assertIn("未作出代码质量判断", scope)

    def test_paginated_files_are_all_included(self):
        api = Mock()
        api.request.side_effect = [[FILE] * 100, [{**FILE, "filename": "second-page.py"}]]
        files = review.get_pages(api, "/files", 30)
        self.assertEqual(len(files), 101)
        self.assertIn("page=2", api.request.call_args.args[1])


class ReviewFlowTests(unittest.TestCase):
    def setUp(self):
        self.config = review.Config.from_env(ENV)
        self.github, self.amd = Mock(), Mock()
        self.amd.request.return_value = response()
        self.output = StringIO()

    def run_review(self, github_results, **kwargs):
        self.github.request.side_effect = github_results
        with redirect_stdout(self.output):
            review.run(self.config, github=self.github, amd=self.amd, **kwargs)

    def test_posts_only_comment_bound_to_inspected_commit(self):
        self.run_review([PR, [], [FILE], [], PR, {}])
        method, path, payload = self.github.request.call_args.args
        self.assertEqual(method, "POST")
        self.assertEqual(path, "/repos/windrise/example/pulls/42/reviews")
        self.assertEqual(payload["event"], "COMMENT")
        self.assertEqual(payload["commit_id"], SHA)
        self.assertIn(review.marker(SHA), payload["body"])
        self.assertIn("未执行测试", payload["body"])
        self.assertEqual(self.amd.request.call_count, 1)

    def test_duplicate_bot_review_skips_model_and_post(self):
        previous = {"user": {"login": "github-actions[bot]"}, "body": review.marker(SHA)}
        self.run_review([PR, [previous]])
        self.amd.request.assert_not_called()
        self.assertEqual(self.github.request.call_count, 2)

    def test_human_marker_does_not_suppress_review(self):
        self.assertFalse(review.already_reviewed([
            {"user": {"login": "human"}, "body": review.marker(SHA)}], SHA))

    def test_context_changes_allow_review_but_identical_context_deduplicates(self):
        previous = {"user": {"login": "github-actions[bot]"}, "body": review.marker(SHA, "focus")}
        self.assertTrue(review.already_reviewed([previous], SHA, "focus"))
        self.assertFalse(review.already_reviewed([previous], SHA, "new focus"))
        self.assertFalse(review.already_reviewed([previous], SHA))

    def test_stale_head_or_closed_pr_never_posts(self):
        for latest in ({**PR, "head": {"sha": "b" * 40}}, {**PR, "state": "closed"}):
            with self.subTest(latest=latest):
                self.github.reset_mock()
                self.run_review([PR, [], [FILE], [], latest])
                self.assertTrue(all(c.args[0] == "GET" for c in self.github.request.call_args_list))
        self.assertIn("stale analysis skipped", self.output.getvalue())

    def test_concurrent_completion_prevents_duplicate_post(self):
        previous = {"user": {"login": "github-actions[bot]"}, "body": review.marker(SHA)}
        self.run_review([PR, [], [FILE], [previous]])
        self.assertEqual(self.github.request.call_count, 4)
        self.assertIn("Another run", self.output.getvalue())

    def test_no_patch_posts_clear_scope_without_model_call(self):
        self.run_review([PR, [], [{"filename": "binary.png"}], [], PR, {}])
        self.amd.request.assert_not_called()
        self.assertIn("未作出代码质量判断", self.github.request.call_args.args[2]["body"])

    def test_dry_run_does_not_post_and_does_not_print_reasoning(self):
        self.amd.request.return_value = response(reasoning_content="private-reasoning")
        self.run_review([PR, [], [FILE], PR], dry_run=True)
        self.assertTrue(all(c.args[0] == "GET" for c in self.github.request.call_args_list))
        self.assertNotIn("private-reasoning", self.output.getvalue())
        self.assertIn("Dry run complete", self.output.getvalue())

    def test_invalid_empty_incomplete_or_secret_output_is_rejected(self):
        invalid = [response(""), response("  "), response(None), response("x" * 24_001),
                   response("<think>reasoning</think>"), response(ENV["AMD_API_KEY"]),
                   response(ENV["GITHUB_TOKEN"]), {"choices": []},
                   {"choices": [{"message": {"reasoning_content": "private"}}]},
                   {"choices": [{"message": {"content": "partial"}, "finish_reason": "length"}]}]
        for result in invalid:
            self.amd.request.return_value = result
            self.github.reset_mock()
            with self.subTest(result_type=type(result)), self.assertRaises(review.ReviewError) as caught:
                self.run_review([PR, [], [FILE]])
            self.assertTrue(all(c.args[0] == "GET" for c in self.github.request.call_args_list))
            self.assertNotIn("private", str(caught.exception))
            self.assertNotIn(ENV["AMD_API_KEY"], str(caught.exception))


if __name__ == "__main__":
    unittest.main()
