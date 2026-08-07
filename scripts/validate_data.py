import json
from pathlib import Path
root = Path(__file__).resolve().parents[1]
syllabus = json.loads((root / "subjects/numerical-methods-and-analysis/syllabus.json").read_text(encoding="utf-8"))
assert sum(u["allocated_hours"] for u in syllabus["units"]) == syllabus["official_total_hours"] == 45
ids = [u["unit_id"] for u in syllabus["units"]]
assert len(ids) == len(set(ids)) == 7
print("OK: syllabus unit count=7, total hours=45, unit IDs unique")
