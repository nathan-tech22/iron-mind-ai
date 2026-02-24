from sqlalchemy import create_engine, Column, String, Integer, Float, Boolean, DateTime, JSON, Text, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.sql import func
from app.core.config import settings
import uuid
import enum

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def gen_uuid():
    return str(uuid.uuid4())

class ScanStatus(str, enum.Enum):
    pending = "pending"
    running = "running"
    completed = "completed"
    failed = "failed"

class Severity(str, enum.Enum):
    critical = "critical"
    high = "high"
    medium = "medium"
    low = "low"
    info = "info"

class Target(Base):
    __tablename__ = "targets"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String, nullable=False)
    description = Column(Text)
    endpoint_url = Column(String, nullable=False)
    auth_type = Column(String, default="bearer")  # bearer, api_key, none
    auth_header = Column(String)
    auth_value = Column(String)  # stored; in prod use vault
    request_template = Column(JSON)  # how to format the request body
    response_path = Column(String, default="$.response")  # jsonpath to extract response
    vendor = Column(String)
    model_name = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    scans = relationship("Scan", back_populates="target")

class Scan(Base):
    __tablename__ = "scans"

    id = Column(String, primary_key=True, default=gen_uuid)
    target_id = Column(String, ForeignKey("targets.id"), nullable=False)
    name = Column(String, nullable=False)
    status = Column(Enum(ScanStatus), default=ScanStatus.pending)
    probe_categories = Column(JSON, default=list)  # which probe categories to run
    total_probes = Column(Integer, default=0)
    completed_probes = Column(Integer, default=0)
    failed_probes = Column(Integer, default=0)
    findings_count = Column(Integer, default=0)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    celery_task_id = Column(String)
    target = relationship("Target", back_populates="scans")
    findings = relationship("Finding", back_populates="scan")

class Finding(Base):
    __tablename__ = "findings"

    id = Column(String, primary_key=True, default=gen_uuid)
    scan_id = Column(String, ForeignKey("scans.id"), nullable=False)
    probe_id = Column(String, nullable=False)
    probe_name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    severity = Column(Enum(Severity), nullable=False)
    prompt_sent = Column(Text, nullable=False)
    response_received = Column(Text)
    vulnerability_detected = Column(Boolean, default=False)
    judge_score = Column(Float)
    judge_reasoning = Column(Text)
    hipaa_reference = Column(String)
    mitre_atlas_ref = Column(String)
    owasp_ref = Column(String)
    remediation = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    scan = relationship("Scan", back_populates="findings")
