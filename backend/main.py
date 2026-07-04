"""Legacy entrypoint — use `uvicorn app.main:app` from the backend directory."""
from app.main import app

__all__ = ["app"]
