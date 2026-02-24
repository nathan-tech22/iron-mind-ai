from fastapi import APIRouter
from app.probes.healthcare_probes import PROBES, PROBE_CATEGORIES, get_probes_by_category

router = APIRouter()

@router.get("/")
def list_probes(category: str = None):
    if category:
        return get_probes_by_category([category])
    return PROBES

@router.get("/categories")
def list_categories():
    return [
        {"id": k, "name": v, "count": len([p for p in PROBES if p["category"] == k])}
        for k, v in PROBE_CATEGORIES.items()
    ]

@router.get("/{probe_id}")
def get_probe(probe_id: str):
    probe = next((p for p in PROBES if p["id"] == probe_id), None)
    if not probe:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Probe not found")
    return probe
