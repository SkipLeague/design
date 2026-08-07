# Releasing @skipleague/design

Two workflows, two different levels of trust, on purpose.

## Why it's two stages, not one

Publishing a version means every app that installs `@skipleague/design` picks
it up automatically, with no review step of its own — there's no undo once
it's on the npm registry. That's a different risk than merging a PR: a PR
still needs someone to press merge. A release needs someone to press
**approve**, deliberately, as its own step, separate from the PR that prepared
it.

- **`release.yml`** — `workflow_dispatch` only. Tags an existing commit on
  `main` and pushes the tag. Nothing else. Gated by the `release`
  [environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment):
  the job does not start until a required reviewer clicks **Approve** in the
  Actions UI.
- **`publish.yml`** — triggered by that tag push. Builds and runs
  `npm publish` via OIDC Trusted Publishing (no stored npm token — see that
  file's own header). This is the **only** workflow npm's Trusted Publisher
  config trusts, by filename. A different workflow calling `npm publish`
  directly would not be trusted, even if someone wrote one.

So the chain is: **tag creation is gated by human approval → tag push
triggers publish → publish is the part that actually ships.** There is no path
that skips the approval step.

## Why an agent session can trigger `release.yml` but not push a tag directly

An agent's git credential here can push branches and open PRs, but a direct
`git push` of a `v*` tag is rejected — deliberately, at the credential level,
not by this workflow. The reasoning: publishing to a public registry is the
single highest-leverage action available in this repo's toolchain, and it
should never be one step removed from "an agent decided this was ready."

`release.yml` is the sanctioned path *around* that block, not through it:
triggering the dispatch only *starts a request*. The tag write itself happens
from a short-lived, workflow-scoped `GITHUB_TOKEN`, minted by GitHub only
after a human clicks Approve — never from the agent's own credential. Widening
the agent's credential to allow tag pushes was considered and rejected in
favor of this: same destination, but the actual write is always downstream of
a human's explicit click, not upstream of it.

## One-time setup (repo owner, in the GitHub UI — nothing here is scriptable)

1. **Settings → Environments → New environment.** Name it exactly `release`
   (the workflow's `environment:` key has to match).
2. Under **Deployment protection rules → Required reviewers**, add yourself
   (and anyone else who should be able to approve a release).
3. Done. `release.yml` already references this environment; no other config
   is needed.

## Cutting a release

1. Merge the PR that bumps `version` in `package.json` on `main`, same as any
   other change here.
2. Trigger **Release (create + push a version tag)** from the Actions tab (or
   have an agent session trigger it via the GitHub API) with that same
   version as the input, e.g. `0.14.0` — no leading `v`.
3. **Approve the pending deployment** — Actions tab → the waiting run → Review
   deployments → Approve. This is the actual release decision; everything
   before this step is just preparation.
4. The tag push fires **Publish to npm** automatically. Watch that run (linked
   from the release run's summary) to confirm the publish succeeded.

`release.yml` refuses to run if the input version doesn't match what's
actually committed in `package.json`, and refuses to re-tag a version that
already exists — so a typo or a stale run fails loudly instead of tagging the
wrong commit or clobbering a real release.
