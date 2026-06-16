"""
Fetch all 1,500 exercises from ExerciseDB (AscendAPI) Free Tier.
Saves to source/apps/web/src/lib/exercisedb_raw.json
"""
import urllib.request
import json
import time
import sys

API_BASE = "https://oss.exercisedb.dev/api/v1/exercises"
OUTPUT = "source/apps/web/src/lib/exercisedb_raw.json"
PAGE_SIZE = 25  # API always returns 25 per page
REQUEST_DELAY = 0.4

all_exercises = []
page = 0
url = f"{API_BASE}?limit={PAGE_SIZE}"
next_cursor = None

print("Fetching ExerciseDB dataset...", flush=True)

while url:
    page += 1
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "NextFit/1.0"})
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read())

        exercises = data.get("data", [])
        meta = data.get("meta", {})
        all_exercises.extend(exercises)

        print(f"  Page {page}: {len(exercises)} exercises | total: {len(all_exercises)}/{meta.get('total', '?')}", flush=True)

        if meta.get("hasNextPage") and meta.get("nextCursor"):
            next_cursor = meta["nextCursor"]
            url = f"{API_BASE}?limit={PAGE_SIZE}&after={next_cursor}"
        else:
            url = None

        time.sleep(REQUEST_DELAY)

    except Exception as e:
        print(f"  Error on page {page}: {e}", flush=True)
        # Retry once after longer delay
        if page > 1:
            time.sleep(3)
            continue
        break

print(f"\nTotal fetched: {len(all_exercises)}", flush=True)

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(all_exercises, f, ensure_ascii=False, indent=2)

print(f"Saved to {OUTPUT}", flush=True)
