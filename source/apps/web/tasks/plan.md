# Implementation Plan: Cumulative Exercise Accumulation Across Modes

## Overview

Fix the suggest-mode `useEffect` so exercise suggestions always **append** instead of **replace** the current exercise list. Currently, every time `selectedMuscles` changes in "Gợi ý" mode, the entire exercise list is overwritten — this destroys exercises added from "Giáo án" or "Tự chọn" modes. The fix makes suggestions cumulative: muscle changes, plan-day loads, and free picks all add to the same growing list.

## Architecture Decisions

- **Append, never replace** — The only exception is the very first page load (initial suggestions with all muscles). All subsequent actions append via the same dedup pattern.
- **Dedup by `ex.id`** — Same pattern already used in `handleAddExercises`, `handleLoadPlanDay`, and `DailyExercise.onAdd`.
- **Undo restores to initial suggestions** — `savedSuggestions` stores the page-load suggestion set; `handleUndo` resets to that baseline.

## Task List

### Task 1: Fix suggest-mode `useEffect` to append (not replace)

**Description:** Change the `useEffect` that fires on `selectedMuscles` change so new suggestions are appended with dedup instead of replacing. The very first invocation (page load with all muscles) still replaces as the initial baseline.

**Acceptance criteria:**
- [ ] Changing muscle pills in "Gợi ý" mode appends new (non-duplicate) exercises
- [ ] Duplicate exercises are not added (dedup by `ex.id`)
- [ ] Exercises from other modes (Giáo án, Tự chọn) survive when muscles change
- [ ] First page load still sets the initial baseline correctly

**Verification:**
- [ ] Build succeeds: `pnpm build`
- [ ] Tests pass: `pnpm test`

**Dependencies:** None

**Files likely touched:**
- `src/app/page.tsx` (lines 71-76: the `useEffect` + `setSavedSuggestions`)

**Estimated scope:** Small (1 file, ~5 lines changed)

---

### Task 2: Update `savedSuggestions` / `handleUndo` for cumulative behavior

**Description:** `savedSuggestions` currently tracks the initial suggestion set. With cumulative appending, `hasChanges` will always be true after any interaction. Update the logic so:
- `savedSuggestions` stores only the page-load baseline (initial suggestions)
- `handleUndo` restores `suggestedExercises` to that baseline (removing everything added after)
- `hasChanges` compares current list to baseline

**Acceptance criteria:**
- [ ] After the first suggestion load, `savedSuggestions` is frozen to that baseline
- [ ] `hasChanges` correctly shows `true` when exercises differ from baseline
- [ ] `handleUndo` restores to baseline (removes plan-day loads, free picks, etc.)

**Verification:**
- [ ] Build succeeds: `pnpm build`
- [ ] Tests pass: `pnpm test`

**Dependencies:** Task 1 (must be done first for the new append logic)

**Files likely touched:**
- `src/app/page.tsx` (the `useEffect`, `savedSuggestions`, `hasChanges`, `handleUndo`)

**Estimated scope:** Small (1 file, ~10 lines changed)

---

### Checkpoint: Core Logic

- [ ] `pnpm build` passes
- [ ] `pnpm test` — all 126 tests pass
- [ ] Manual check: select muscles in Gợi ý mode → exercises append
- [ ] Manual check: switch to Giáo án → click a day → exercises append
- [ ] Manual check: switch to Tự chọn → pick exercises → exercises append
- [ ] Manual check: "Hoàn tác" restores to baseline
- [ ] Review with human before proceeding

---

### Task 3: Verify edge cases

**Description:** Test edge cases for cumulative behavior.

**Acceptance criteria:**
- [ ] Switching modes preserves exercise list (no reset)
- [ ] All-muscle default → select a specific muscle → suggestions append correctly
- [ ] Click same plan day twice → no duplicates
- [ ] Pick same exercise from picker → no duplicates
- [ ] High-participation scenario: cycle through all 3 modes, add 20+ exercises, verify count

**Verification:**
- [ ] Build succeeds: `pnpm build`
- [ ] Tests pass: `pnpm test`

**Dependencies:** Tasks 1-2

**Files likely touched:**
- `src/app/page.tsx` (no code changes, just verification)

**Estimated scope:** Verification only

---

### Checkpoint: Complete

- [ ] All tasks completed
- [ ] All tests pass
- [ ] Build clean
- [ ] Exercises accumulate across all modes without replacement
- [ ] Ready for review

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| `savedSuggestions` not tracking correctly after append | Undo shows wrong state | Freeze `savedSuggestions` at page load, never update on muscle changes |
| Duplicate suggestions when muscles overlap | Double entries | Dedup by `ex.id` in the append logic |
| Too many exercises accumulated | UX clutter | User can remove exercises individually via `X` button, or use "Hoàn tác" to reset |
| Empty-state confusion when switching modes | User sees no exercises | The default suggestion (all muscles) still loads on page mount |

## Open Questions

- Should `handleUndo` remove ALL post-baseline exercises (current plan) or should it be per-mode? Clarify with human.
