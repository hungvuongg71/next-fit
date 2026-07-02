# Todo: Fix pnpm Lockfile Sync for CI

## Instructions
- Update status in real time; don't batch completions
- Mark `completed` only after the required work is actually done, including any required verification
- Keep exactly one `in_progress` while work remains

---

### Phase 1: Fix

- [ ] **Task 1: Regenerate pnpm-lock.yaml to remove stale syne reference**
  - Run `pnpm install --no-frozen-lockfile` in `source/`
  - Verify with `pnpm install --frozen-lockfile`, `pnpm build`, `pnpm test`
  - Files: `source/pnpm-lock.yaml`

### Checkpoint: After Task 1
- [ ] `pnpm install --frozen-lockfile` passes
- [ ] `pnpm build` passes
- [ ] `pnpm test` passes
- [ ] CI simulation passes

### Phase 2: CI Hardening (optional — ask human)

- [ ] **Task 2: Add lockfile validation to CI** (ask first)
  - Add explicit lockfile check in deploy.yml
  - Files: `.github/workflows/deploy.yml`

### Checkpoint: Complete
- [ ] Lockfile is in sync with package.json
- [ ] CI would pass on `main`
- [ ] Ready for review
