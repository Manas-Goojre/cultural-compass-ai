from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Cultural Compass AI"
    app_env: str = "development"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    google_cloud_project: str = ""
    google_cloud_region: str = "us-central1"
    gemini_model: str = "gemini-2.5-flash"
    gemini_api_key: str = ""
    gemini_timeout_seconds: int = 45
    gemini_max_retries: int = 2

    google_client_id: str = ""
    auth_required: bool = True

    app_default_language: str = "en"
    app_default_currency: str = "USD"
    cache_ttl_seconds: int = 300
    log_level: str = "INFO"
    enable_prompt_logging: bool = True


@lru_cache
def get_settings() -> Settings:
    return Settings()
