# Todo: Cumulative Exercise Accumulation

## Instructions
- Update status in real time; don't batch completions
- Mark `completed` only after the required work is actually done, including any required verification
- Keep exactly one `in_progress` while work remains

---

- [ ] Task 1: Fix suggest-mode `useEffect` to append (not replace)
  - Acceptance: muscle changes append deduped exercises; first load still sets baseline
  - Verify: `pnpm build`, `pnpm test`
  - Files: `src/app/page.tsx`

- [ ] Task 2: Update `savedSuggestions` and `handleUndo` for cumulative behavior
  - Acceptance: `savedSuggestions` frozen at baseline; `handleUndo` restores to baseline
  - Verify: `pnpm build`, `pnpm test`
  - Files: `src/app/page.tsx`

### Checkpoint: Core Logic
- [ ] Build + tests pass
- [ ] Manual: all 3 modes append correctly
- [ ] Manual: "Hoàn tác" restores to baseline
- [ ] Human review before continuing

- [ ] Task 3: Verify edge cases (no duplicates, mode switching preserves list, high-participation)
  - Acceptance: all edge cases pass
  - Verify: `pnpm build`, `pnpm test`

### Checkpoint: Complete
- [ ] All tasks done
- [ ] Build + tests pass
- [ ] Ready for review
