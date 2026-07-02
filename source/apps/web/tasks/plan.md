# Implementation Plan: Fix pnpm Lockfile Sync for CI

## Overview

Fix the `ERR_PNPM_OUTDATED_LOCKFILE` error in GitHub Actions CI. The `pnpm-lock.yaml` still contains `@fontsource/syne` as a specifier, but `apps/web/package.json` no longer lists that dependency (removed in commit `546c2b0`). The lockfile was only partially updated — `@fontsource/dm-sans` entries were added but `@fontsource/syne` specifier was not removed.

When CI runs `pnpm install --frozen-lockfile`, pnpm detects the mismatch between lockfile specifiers and package.json specs and exits with code 1.

## Architecture Decisions

- **Regenerate via `pnpm install`** — Manual lockfile editing is error-prone. Running `pnpm install --no-frozen-lockfile` lets pnpm correctly reconcile the lockfile.
- **Single commit** — This is a one-dependency cleanup; no reason to split across multiple commits.

## Task List

### Phase 1: Fix

### Task 1: Regenerate pnpm-lock.yaml to remove stale syne reference

**Description:** Run `pnpm install --no-frozen-lockfile` in the `source/` directory to regenerate `pnpm-lock.yaml`. This will remove the `@fontsource/syne` specifier, packages, and snapshot entries that no longer correspond to any dependency in `apps/web/package.json`.

**Acceptance criteria:**
- [ ] `pnpm install --frozen-lockfile` passes after regeneration
- [ ] Lockfile no longer references `@fontsource/syne` in `importers` (specifiers)
- [ ] Only lockfile is changed (no unintended package.json modifications)

**Verification:**
- [ ] `pnpm install --frozen-lockfile` succeeds
- [ ] `git diff --stat` shows only `pnpm-lock.yaml` changed
- [ ] `pnpm build` succeeds
- [ ] `pnpm test` passes

**Dependencies:** None

**Files likely touched:**
- `source/pnpm-lock.yaml`

**Estimated scope:** XS (1 file, lockfile-only change)

### Checkpoint: After Task 1
- [ ] `pnpm install --frozen-lockfile` passes
- [ ] `pnpm build` passes
- [ ] `pnpm test` passes
- [ ] CI would succeed with this lockfile

### Phase 2: CI Hardening (optional, ask first)

### Task 2: Add lockfile validation to CI

**Description (optional):** Add a step in `.github/workflows/deploy.yml` that checks lockfile consistency earlier in the pipeline, or switch to `pnpm install --frozen-lockfile` with a clear error message pointing to the fix command.

**Acceptance criteria:**
- [ ] CI fails fast with a helpful message if lockfile is out of sync
- [ ] No change to existing behavior when lockfile is in sync

**Verification:**
- [ ] CI passes on current branch
- [ ] Simulated out-of-sync lockfile produces a clear error

**Dependencies:** Task 1

**Files likely touched:**
- `.github/workflows/deploy.yml`

**Estimated scope:** S (1 file, ~3 lines)

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| `pnpm install` changes more than expected | Hard to review | Run `git diff` after install to verify only lockfile changed |
| Local pnpm version differs from CI | Different lockfile format | pnpm 9 is specified in both `package.json` (packageManager) and CI action setup |
| CI still fails after fix | Pipeline blocked | Manually verify with `--frozen-lockfile` locally first |

## Open Questions

- Should we add a `pnpm install --frozen-lockfile` check as a pre-commit hook or CI lint step to prevent future drift?
