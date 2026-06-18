#!/usr/bin/env python3
"""
Batch-generate Vietnamese exercise instructions via GitHub Models API (OpenAI-compatible).
Processes exercises in batches of 5, writes directly to exercises.json with resume.
"""

import json
import os
import re
import shutil
import sys
import time
import urllib.request
import urllib.error

EXERCISES_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "lib", "exercises.json")
BACKUP_PATH = EXERCISES_PATH.replace(".json", "_backup.json")
BATCH_SIZE = 5
BATCH_DELAY = 8
SAVE_INTERVAL = 30
RETRY_LIMIT = 3
RETRY_DELAY = 10

API_BASE = "https://models.inference.ai.azure.com"
MODELS = [
    "gpt-4o-mini",
    "Meta-Llama-3.1-70B-Instruct",
    "Mistral-large-2407",
]

PROMPT_TEMPLATE = """Bạn là huấn luyện viên thể hình. Với mỗi bài tập dưới đây, hãy viết 3-5 bước hướng dẫn bằng tiếng Việt.

{exercises}

Viết hướng dẫn chi tiết cho từng bài: tư thế chuẩn bị, cách thực hiện (hít/thở), và lưu ý kỹ thuật.
Trả lời theo định dạng JSON chính xác dưới đây, không thêm gì khác:

```json
[
  {{
    "index": 0,
    "steps": ["Bước 1: ...", "Bước 2: ...", "Bước 3: ..."]
  }},
  ...
]```"""


def vprint(*args, **kwargs):
    kwargs.setdefault("flush", True)
    print(*args, **kwargs)


def _build_batch_prompt(batch: list[tuple[int, dict]]) -> str:
    lines = []
    for idx, (_, ex) in enumerate(batch):
        sec = ", ".join(
            ex.get("musclesSecondary_vi", ex.get("musclesSecondary", []))
            or ex.get("musclesSecondary", [])
        ) or "Không có"
        lines.append(
            f"Bài {idx}:\n"
            f"- Tên: {ex.get('name', '')}\n"
            f"- Nhóm cơ chính: {ex.get('muscleGroup', '')} ({ex.get('muscleGroup_vi', ex.get('muscleGroup', ''))})\n"
            f"- Nhóm cơ phụ: {sec}\n"
            f"- Thể loại: {ex.get('category', '')}\n"
            f"- Thiết bị: {ex.get('equipment', '')}\n"
            f"- Cấp độ: {ex.get('level', '')}\n"
            f"- Hiệp/Lần: {ex.get('sets', '')} × {ex.get('reps', '')}\n"
            f"- Nghỉ: {ex.get('restSeconds', '')}s\n"
        )
    return PROMPT_TEMPLATE.format(exercises="\n---\n".join(lines))


def _call_api(prompt: str, api_key: str) -> str | None:
    for model in MODELS:
        result = _try_model(prompt, api_key, model)
        if result and len(result) >= 50:
            return result
    vprint("  ⏳ Tất cả model đều fail (có thể hết quota), đợi 30s...", end=" ", flush=True)
    time.sleep(30)
    return _call_api(prompt, api_key)


def _try_model(prompt: str, api_key: str, model: str) -> str | None:
    url = f"{API_BASE}/chat/completions"
    payload = json.dumps({
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 1500,
    }).encode("utf-8")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }

    for attempt in range(RETRY_LIMIT):
        try:
            req = urllib.request.Request(url, data=payload, headers=headers)
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = json.loads(resp.read().decode("utf-8"))
            text = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            if text and text.strip():
                return text.strip()
            return None
        except urllib.error.HTTPError as e:
            if e.code == 429:
                vprint(f"  429 rate limited on {model}, thử model khác...", end=" ", flush=True)
                return None
            elif e.code in (403, 400, 404):
                vprint(f"  {e.code} on {model}, skip...", end=" ", flush=True)
                return None
            else:
                if attempt < RETRY_LIMIT - 1:
                    time.sleep(RETRY_DELAY * (attempt + 2))
        except Exception as e:
            vprint(f"  Lỗi: {e}", end=" ", flush=True)
            if attempt < RETRY_LIMIT - 1:
                time.sleep(RETRY_DELAY)
    return None


def _parse_json_from_text(text: str) -> list[dict] | None:
    m = re.search(r'```json\s*(\[.*?\])\s*```', text, re.DOTALL)
    if m:
        text = m.group(1)
    text = text.strip()
    if text.startswith("["):
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass
    return None


def needs_processing(ex: dict) -> bool:
    inst = ex.get("exerciseDbInstructions_vi", [])
    return not inst or not any(inst)


def main():
    api_key = os.environ.get("GITHUB_TOKEN", "").strip()
    if not api_key:
        vprint("❌ Cần GitHub token. export GITHUB_TOKEN='ghp_your_token'")
        vprint("   Tạo tại: https://github.com/settings/tokens")
        sys.exit(1)

    if not os.path.exists(BACKUP_PATH):
        vprint(f"📦 Backup: {BACKUP_PATH}")
        shutil.copy2(EXERCISES_PATH, BACKUP_PATH)

    vprint(f"📖 Đọc {EXERCISES_PATH}...")
    with open(EXERCISES_PATH, encoding="utf-8") as f:
        data = json.load(f)

    exercises = data["exercises"]
    total = len(exercises)
    todo_indices = [i for i, ex in enumerate(exercises) if needs_processing(ex)]
    done_count = total - len(todo_indices)
    total_todo = len(todo_indices)

    vprint(f"Tổng: {total} | Đã xử lý: {done_count} | Còn lại: {total_todo}")

    if total_todo == 0:
        vprint("🎉 Hoàn thành!")
        return

    batches = [todo_indices[i:i + BATCH_SIZE] for i in range(0, total_todo, BATCH_SIZE)]
    success = 0
    failed = 0
    start_time = time.time()

    for b_idx, batch_indices in enumerate(batches):
        batch = [(i, exercises[i]) for i in batch_indices]
        names = [ex["name"] for _, ex in batch]
        elapsed = time.time() - start_time
        success_rate = (b_idx + 1) / elapsed if elapsed > 0 else 0
        remaining = len(batches) - b_idx - 1
        eta_secs = remaining / success_rate if success_rate > 0 else 0
        eta_str = f"{eta_secs/3600:.1f}h" if eta_secs > 3600 else f"{eta_secs/60:.0f}m"
        vprint(f"\n[{b_idx+1}/{len(batches)}] (ETA {eta_str}) {', '.join(n[:35] for n in names)}")

        prompt = _build_batch_prompt(batch)
        resp = _call_api(prompt, api_key)

        if not resp:
            for i, _ in batch:
                exercises[i]["exerciseDbInstructions_vi"] = []
                failed += 1
            vprint(f"  ✗ API không trả về kết quả")
            time.sleep(BATCH_DELAY)
            continue

        parsed = _parse_json_from_text(resp)

        if parsed and isinstance(parsed, list):
            ok = 0
            for item in parsed:
                idx_in_batch = item.get("index")
                steps = item.get("steps", [])
                if isinstance(idx_in_batch, int) and 0 <= idx_in_batch < len(batch) and isinstance(steps, list) and len(steps) >= 2:
                    i, _ = batch[idx_in_batch]
                    exercises[i]["exerciseDbInstructions_vi"] = steps
                    ok += 1
                    for s in steps[:2]:
                        vprint(f"  · {s[:100]}")
                    if len(steps) > 2:
                        vprint(f"  · ... (+{len(steps)-2} bước nữa)")
                else:
                    vprint(f"  ⚠ index {idx_in_batch} không hợp lệ")
            failed_batch = len(batch) - ok
            success += ok
            failed += failed_batch
            if failed_batch > 0:
                for idx_in_batch in range(len(batch)):
                    if exercises[batch[idx_in_batch][0]].get("exerciseDbInstructions_vi", []) == []:
                        exercises[batch[idx_in_batch][0]]["exerciseDbInstructions_vi"] = []
        else:
            for i, _ in batch:
                exercises[i]["exerciseDbInstructions_vi"] = []
                failed += 1
            preview = resp[:200].replace("\n", " ")
            vprint(f"  ✗ Không parse được JSON: {preview}...")

        if (b_idx + 1) % SAVE_INTERVAL == 0 or b_idx == len(batches) - 1:
            with open(EXERCISES_PATH, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            vprint(f"  💾 Đã lưu ({done_count + success}/{total})")

        if b_idx < len(batches) - 1:
            time.sleep(BATCH_DELAY)

    elapsed = time.time() - start_time
    vprint()
    vprint("━" * 50)
    vprint(f"✅ Hoàn thành trong {elapsed/60:.0f} phút!")
    vprint(f"   Thành công: {success}, Thất bại: {failed}")
    vprint(f"   Tổng: {done_count + success}/{total}")


if __name__ == "__main__":
    main()
