from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import json

from app.core.database import get_db, Target
from app.services.target_connector import test_target_connection

router = APIRouter()


class TargetCreate(BaseModel):
    name: str
    description: Optional[str] = None
    endpoint_url: str
    auth_type: str = "bearer"
    auth_header: Optional[str] = "Authorization"
    auth_value: Optional[str] = None
    request_template: Optional[dict] = None
    response_path: Optional[str] = "$.choices[0].message.content"
    vendor: Optional[str] = None
    model_name: Optional[str] = None


class TargetResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    endpoint_url: str
    auth_type: str
    vendor: Optional[str]
    model_name: Optional[str]
    created_at: str

    class Config:
        from_attributes = True


@router.get("/")
def list_targets(db: Session = Depends(get_db)):
    targets = db.query(Target).all()
    return [
        {
            "id": t.id,
            "name": t.name,
            "description": t.description,
            "endpoint_url": t.endpoint_url,
            "auth_type": t.auth_type,
            "vendor": t.vendor,
            "model_name": t.model_name,
            "created_at": str(t.created_at),
        }
        for t in targets
    ]


@router.post("/")
def create_target(target: TargetCreate, db: Session = Depends(get_db)):
    db_target = Target(**target.model_dump())
    db.add(db_target)
    db.commit()
    db.refresh(db_target)
    return {"id": db_target.id, "name": db_target.name, "message": "Target created"}


@router.get("/{target_id}")
def get_target(target_id: str, db: Session = Depends(get_db)):
    target = db.query(Target).filter(Target.id == target_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
    return {
        "id": target.id,
        "name": target.name,
        "description": target.description,
        "endpoint_url": target.endpoint_url,
        "auth_type": target.auth_type,
        "vendor": target.vendor,
        "model_name": target.model_name,
        "response_path": target.response_path,
    }


@router.post("/{target_id}/test")
async def test_target(target_id: str, db: Session = Depends(get_db)):
    target = db.query(Target).filter(Target.id == target_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
    result = await test_target_connection(target)
    return result


@router.delete("/{target_id}")
def delete_target(target_id: str, db: Session = Depends(get_db)):
    target = db.query(Target).filter(Target.id == target_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
    db.delete(target)
    db.commit()
    return {"message": "Target deleted"}
