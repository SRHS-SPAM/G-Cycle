from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # App
    APP_NAME: str = "G-Cycle Backend"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # Security
    SECRET_KEY: str = "dev-secret-key-change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    GUEST_TOKEN_EXPIRE_MINUTES: int = 120

    # Database
    DATABASE_URL: str = "postgresql+psycopg2://gcycle:gcycle@db:5432/gcycle"

    # Redis
    REDIS_URL: str = "redis://redis:6379/0"

    # Business rules
    NEAR_FULL_THRESHOLD: float = 0.8


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
