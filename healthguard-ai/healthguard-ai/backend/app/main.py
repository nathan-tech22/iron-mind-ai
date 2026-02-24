from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.database import engine, Base
from app.api import targets, scans, probes, reports

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="HealthGuard AI Red Team Platform",
    description="Healthcare-specific AI chatbot vulnerability scanner",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(targets.router, prefix="/api/targets", tags=["Targets"])
app.include_router(scans.router, prefix="/api/scans", tags=["Scans"])
app.include_router(probes.router, prefix="/api/probes", tags=["Probes"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "HealthGuard AI"}
