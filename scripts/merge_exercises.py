"""
Merge ExerciseDB (1,500 exercises) with existing wger dataset (500 exercises).
- Maps ExerciseDB format to our Exercise type
- Matches by name to carry over Vietnamese data + wger images
- Outputs merged exercises.json
"""
import json
import re
import sys

EXISTING_PATH = "source/apps/web/src/lib/exercises.json"
EXERCISEDB_PATH = "source/apps/web/src/lib/exercisedb_raw.json"
OUTPUT_PATH = "source/apps/web/src/lib/exercises.json"

# ─── Mappings ───────────────────────────────────────────────────────────

BODY_PART_TO_MUSCLE_GROUP = {
    "chest": "Chest", "back": "Back", "shoulders": "Shoulders",
    "upper arms": "Arms", "lower arms": "Arms",
    "upper legs": "Legs", "lower legs": "Legs",
    "waist": "Core", "cardio": "Cardio", "neck": "Back",
}

EQUIPMENT_MAP = {
    "barbell": "Barbell", "dumbbell": "Dumbbell", "body weight": "Bodyweight",
    "cable": "Cable", "kettlebell": "Kettlebell", "pull-up bar": "Pull-up bar",
    "machine": "Machine", "ez barbell": "EZ Curl Bar", "resistance band": "Resistance Band",
    "suspension": "TRX / Suspension", "gym mat": "Gym mat", "swiss ball": "Swiss Ball",
    "bench": "Bench", "incline bench": "Incline bench", "foam roller": "Foam Roll",
    "assisted": "Bodyweight", "weighted": "Bodyweight", "rope": "Cable",
    "roller": "Foam Roll", "trap bar": "Barbell", "landmine": "Barbell",
    "medicine ball": "Dumbbell", "stability ball": "Swiss Ball", "step": "Bodyweight",
    "wheel": "Bodyweight", "band": "Resistance Band", "battle rope": "Cable",
    "sled": "Bodyweight", "tire": "Bodyweight", "box": "Bodyweight",
    "broomstick": "Bodyweight", "olympic": "Barbell", "smith machine": "Machine",
    "exercise band": "Resistance Band", "physio ball": "Swiss Ball",
    "exercise ball": "Swiss Ball", "weight plate": "Barbell", "dip bar": "Bodyweight",
    "parallel bar": "Bodyweight", "pit shark": "Machine", "lever": "Machine",
}

CATEGORY_MAP = {
    "chest": "Chest", "back": "Back", "shoulders": "Shoulders",
    "upper arms": "Arms", "lower arms": "Arms",
    "upper legs": "Legs", "lower legs": "Legs",
    "waist": "Abs", "cardio": "Cardio", "neck": "Back",
}

# ─── Helpers ────────────────────────────────────────────────────────────

def norm(name: str) -> str:
    return re.sub(r"[^a-z0-9\s]", "", name.lower().strip()).strip()

def token_match(a_norm: str, b_norm: str) -> bool:
    """Check if sorted tokens match (handles word reordering)."""
    return sorted(a_norm.split()) == sorted(b_norm.split())

def make_description(name: str, instructions: list) -> str:
    if instructions:
        steps = []
        for s in instructions[:5]:
            clean = re.sub(r"Step:\d+", "", s).strip(" :.")
            steps.append(clean)
        return f"Bài tập {name.lower()}. Cách thực hiện: {'; '.join(steps)}"
    return f"Bài tập {name.lower()}. Thực hiện đúng kỹ thuật, hít thở đều và kiểm soát chuyển động."

# ─── Main ───────────────────────────────────────────────────────────────

def main():
    with open(EXISTING_PATH, encoding="utf-8") as f:
        existing_data = json.load(f)
    existing = existing_data.get("exercises", [])
    print(f"Existing exercises: {len(existing)}", flush=True)

    with open(EXERCISEDB_PATH, encoding="utf-8") as f:
        edb_raw = json.load(f)
    print(f"ExerciseDB exercises: {len(edb_raw)}", flush=True)

    # Pre-compute normalized names for all existing exercises
    for ex in existing:
        ex["_norm"] = norm(ex["name"])
        ex["_tokens"] = sorted(ex["_norm"].split())

    # Build multi-index for existing exercises:
    # 1) exact normalized name -> exercise
    exact_index = {}
    for ex in existing:
        exact_index[ex["_norm"]] = ex
    # 2) all normalized names for scanning
    existing_norms = [(i, ex["_norm"]) for i, ex in enumerate(existing)]

    matched_existing = set()
    merged = []
    used_norms = set()

    # Pre-process ExerciseDB exercises
    edb_processed = []
    for edb in edb_raw:
        edb_name = edb["name"].strip()
        edb_norm = norm(edb_name)
        edb_tokens = sorted(edb_norm.split())
        edb_processed.append((edb, edb_name, edb_norm, edb_tokens))

    print(f"Matching...", flush=True)

    # Phase 1: Exact match and token match
    match_results = {}  # edb_idx -> existing_idx

    for edb_idx, (edb, edb_name, edb_norm, edb_tokens) in enumerate(edb_processed):
        best_match = None
        best_type = None

        # Exact match
        if edb_norm in exact_index:
            ex = exact_index[edb_norm]
            best_match = ex
            best_type = "exact"

        # Token match (reordered words)
        if best_match is None:
            for ex in existing:
                if ex["_tokens"] == edb_tokens:
                    best_match = ex
                    best_type = "token"
                    break

        # Substring match (one contains the other)
        if best_match is None:
            for ex in existing:
                if edb_norm in ex["_norm"] or ex["_norm"] in edb_norm:
                    best_match = ex
                    best_type = "substr"
                    break

        if best_match is not None:
            match_results[edb_idx] = (best_match, best_type)

    print(f"  Exact matches: {sum(1 for v in match_results.values() if v[1]=='exact')}", flush=True)
    print(f"  Token matches: {sum(1 for v in match_results.values() if v[1]=='token')}", flush=True)
    print(f"  Substr matches: {sum(1 for v in match_results.values() if v[1]=='substr')}", flush=True)
    print(f"  Total matched: {len(match_results)}", flush=True)

    # Phase 2: Build merged exercises
    for edb_idx, (edb, edb_name, edb_norm, edb_tokens) in enumerate(edb_processed):
        body_parts = edb.get("bodyParts", [])
        equipments = edb.get("equipments", [])
        target_muscles = [m.replace("_", " ").title() for m in edb.get("targetMuscles", [])]
        secondary_muscles = [m.replace("_", " ").title() for m in edb.get("secondaryMuscles", [])]
        instructions = edb.get("instructions", [])
        gif_url = edb.get("gifUrl", "")

        muscle_group = BODY_PART_TO_MUSCLE_GROUP.get(body_parts[0]) if body_parts else "Cardio"
        equipment = "Bodyweight"
        equipment_list = []
        for eq in equipments:
            mapped = EQUIPMENT_MAP.get(eq.lower())
            if mapped:
                if not equipment or equipment == "Bodyweight":
                    equipment = mapped
                if mapped not in equipment_list:
                    equipment_list.append(mapped)
        if not equipment_list:
            equipment_list = ["Bodyweight"]

        category = CATEGORY_MAP.get(body_parts[0]) if body_parts else "Cardio"

        if edb_idx in match_results:
            ex, match_type = match_results[edb_idx]
            matched_existing.add(id(ex))

            new_ex = {
                "id": f"edb-{edb['exerciseId']}",
                "name": edb_name.title(),
                "name_vi": ex.get("name_vi") or edb_name.title(),
                "muscleGroup": muscle_group,
                "muscles": ex.get("muscles") or target_muscles,
                "muscles_vi": ex.get("muscles_vi") or [],
                "musclesSecondary": ex.get("musclesSecondary") or secondary_muscles,
                "musclesSecondary_vi": ex.get("musclesSecondary_vi") or [],
                "level": ex.get("level", "Intermediate"),
                "equipment": equipment,
                "equipmentList": list(set(ex.get("equipmentList", []) + equipment_list)),
                "category": category,
                "sets": ex.get("sets", 4),
                "reps": ex.get("reps", "8-12"),
                "restSeconds": ex.get("restSeconds", 60),
                "description": ex.get("description") or make_description(edb_name, instructions),
                "trainer": ex.get("trainer"),
                "image": ex.get("image") or "",
                "video": ex.get("video") or "",
                "exerciseDbId": edb["exerciseId"],
                "exerciseDbGif": gif_url,
                "exerciseDbInstructions": instructions,
            }
        else:
            new_ex = {
                "id": f"edb-{edb['exerciseId']}",
                "name": edb_name.title(),
                "name_vi": edb_name.title(),
                "muscleGroup": muscle_group,
                "muscles": target_muscles,
                "muscles_vi": [],
                "musclesSecondary": secondary_muscles,
                "musclesSecondary_vi": [],
                "level": "Intermediate",
                "equipment": equipment,
                "equipmentList": equipment_list,
                "category": category,
                "sets": 4,
                "reps": "8-12",
                "restSeconds": 60,
                "description": make_description(edb_name, instructions),
                "image": "",
                "video": "",
                "exerciseDbId": edb["exerciseId"],
                "exerciseDbGif": gif_url,
                "exerciseDbInstructions": instructions,
            }

        merged.append(new_ex)
        used_norms.add(edb_norm)

    # Phase 3: Add unmatched existing exercises
    unmatched_count = 0
    for ex in existing:
        if id(ex) not in matched_existing and ex["_norm"] not in used_norms:
            # Clean up internal fields
            ex.pop("_norm", None)
            ex.pop("_tokens", None)
            # Ensure it has exerciseDbId/exerciseDbGif fields
            ex.setdefault("exerciseDbId", "")
            ex.setdefault("exerciseDbGif", "")
            ex.setdefault("exerciseDbInstructions", [])
            merged.append(ex)
            unmatched_count += 1

    # Clean internal fields from matched exercises
    for ex in merged:
        ex.pop("_norm", None)
        ex.pop("_tokens", None)

    # Phase 4: Write output
    output = {
        "total": len(merged),
        "source": "ExerciseDB (AscendAPI) + wger.de",
        "generated": "2026-06-16",
        "exercises": merged,
    }

    print(f"\n--- Results ---", flush=True)
    print(f"Matched (carried over Vietnamese data): {len(match_results)}", flush=True)
    print(f"Unmatched existing (kept): {unmatched_count}", flush=True)
    print(f"New from ExerciseDB: {len(edb_raw) - len(match_results)}", flush=True)
    print(f"Total merged: {len(merged)}", flush=True)

    with_gif = sum(1 for e in merged if e.get("exerciseDbGif"))
    with_wger = sum(1 for e in merged if e.get("image"))
    print(f"With ExerciseDB GIF: {with_gif} ({with_gif/len(merged)*100:.1f}%)", flush=True)
    print(f"With wger image: {with_wger} ({with_wger/len(merged)*100:.1f}%)", flush=True)
    print(f"With ANY image/GIF: {sum(1 for e in merged if e.get('image') or e.get('exerciseDbGif'))} ({(sum(1 for e in merged if e.get('image') or e.get('exerciseDbGif')))/len(merged)*100:.1f}%)", flush=True)

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\nSaved to {OUTPUT_PATH}", flush=True)

if __name__ == "__main__":
    main()
