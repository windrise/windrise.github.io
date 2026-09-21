# Automated PR review

The `AI Assistant Dispatch` workflow reviews newly opened, updated, and reopened pull requests from this repository. It calls `AI PR Review (AMD DeepSeek)`, which reads the PR's changed-file patches, requests a Markdown review from AMD Radeon, and posts a GitHub review with `COMMENT` status. It never approves or merges a PR and does not execute model-generated commands.

## Configuration

- Repository secret `AMD_API_KEY`: the AMD Radeon API credential.
- Optional repository variable `AMD_REVIEW_MODEL`: defaults to `DeepSeek-V4.1-Flash`.
- API endpoint: `https://developer.amd.com.cn/radeon/api/v1/chat/completions`.

The helper uses Python's standard library and GitHub's short-lived workflow token with read access to repository content and write access to PR reviews. The model receives the PR title, optional maintainer context, filenames, and bounded changed-file patches; it does not receive the GitHub token. Automatic reviews of fork PRs remain excluded by the dispatcher.

Only PR review uses AMD. Existing Gemini issue triage and maintainer-invoked assistance remain separate. The legacy maintainer command `@gemini-cli /review` also routes to the AMD reviewer for compatibility.

## Requests and limits

The reviewer normally makes one model request per PR head commit and review context. Input is capped at 60,000 characters and output at 2,000 tokens. It reports omitted or truncated patches and retries rate-limit or transient server errors a limited number of times. Empty responses and exhausted retries fail visibly instead of posting a successful review. It skips a duplicate review for an already reviewed commit/context and checks that the PR head has not changed before posting.

AMD responses are streamed to keep long generations active. Each socket operation has a timeout of at most 600 seconds, matching the provider's documented wait; retry and stream progress checks share a 660-second budget. The workflow has a hard 13-minute limit. GitHub requests have a 30-second timeout. Interrupted or incomplete streams never produce a review, and network timeouts are reported without printing credentials or response bodies. Once a stream starts, it is not retried automatically.

AMD's shared model service offers free APIs; availability and account limits come from the provider. A `429` response is handled with bounded backoff. No alternate provider or paid fallback is selected automatically.

## Validation

Run the helper's offline tests with:

```sh
python3 -m unittest discover -s tests -p 'test_ai_pr_review.py'
```

`python3 scripts/ai_pr_review.py --dry-run` uses the configured credentials to fetch the PR and request a model review without posting to GitHub. It requires `GITHUB_TOKEN`, `GITHUB_REPOSITORY`, `PR_NUMBER`, and `AMD_API_KEY`.

After pushing a PR update, verify that `AI Assistant Dispatch` succeeds and a review from `github-actions[bot]` appears on that PR. Historical failed runs remain in Actions history.

Provider references: [AMD chat completions and timeouts](https://amd-aim.github.io/radeon-cloud-docs/api/chat-completions/) and [DeepSeek-V4.1-Flash](https://amd-aim.github.io/radeon-cloud-docs/models/deepseek-v4-1-flash/). Thinking is disabled by default for this model; the reviewer leaves `reasoning_effort` unset.
