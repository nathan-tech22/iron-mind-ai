from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "healthguard",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.services.scan_runner"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_soft_time_limit=settings.MAX_SCAN_TIMEOUT,
)
