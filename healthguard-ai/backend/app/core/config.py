from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://healthguard:healthguard@db:5432/healthguard"
    REDIS_URL: str = "redis://redis:6379/0"
    JUDGE_MODEL: str = "gpt-4o"
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    GARAK_REPORT_DIR: str = "/app/reports"
    MAX_SCAN_TIMEOUT: int = 3600  # 1 hour

    class Config:
        env_file = ".env"

settings = Settings()
