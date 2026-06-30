# Implementation Plan: Fix Stats Page React Hooks Error

## Overview

Fix "Rendered fewer hooks than expected" error when clicking a workout entry on the stats page to view its detail.

## Root Cause

In `src/app/stats/page.tsx`, the `StatsContent` component has an **early return** (`if (entry) { return ... }`) at line 54 that skips the `summary` `useMemo` at line 204. When navigating from list view (`/stats`, 5 hooks) to detail view (`/stats?id=xxx`, 4 hooks), React detects the hook count mismatch and throws.

```
List render:  useRouter → useSearchParams → useApp → useMemo(entry) → useMemo(summary)  = 5 hooks ✓
Detail render: useRouter → useSearchParams → useApp → useMemo(entry) → EARLY RETURN       = 4 hooks ✗
```

## Fix

Move the `summary` `useMemo` above the `if (entry)` early return so all hooks are called unconditionally. The summary value is only consumed in the list view path, but computing it in detail view is harmless.

## Architecture Decisions

- **No restructuring** — just move the hook call. Minimal diff, minimal risk.
- **No lazy evaluation** — computing summary on detail view is O(n) over workout history (max 30 entries), negligible.

## Task List

### Phase 1: Single Fix

- [ ] Task 1: Move `summary` useMemo before the early return in `StatsContent`

### Checkpoint
- [ ] App builds without errors
- [ ] Manual test: list view renders normally
- [ ] Manual test: click workout → detail view loads without crash
- [ ] Manual test: navigate back to list view from detail view — works

## Dependencies

- No dependencies — single file change
- No test changes needed (no existing stats page tests)

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Moved code references stale variables | Low | Same closure scope — all variables still accessible |
| `summary` computed unnecessarily in detail view | Low | O(n) on max 30 entries, negligible cost |

## Files Touched

- `src/app/stats/page.tsx` — move `summary` useMemo above line 54

## Verification

1. `pnpm vitest run` — all tests pass
2. Manual: load `/stats` → confirm list renders
3. Manual: click any workout → detail renders without error
4. Manual: navigate back → list still works
