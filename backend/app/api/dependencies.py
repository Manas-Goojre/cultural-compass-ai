from fastapi import Header, HTTPException

from app.config import get_settings
from app.core.errors import AuthError
from app.models.auth import UserInfo
from app.services.auth_service import AuthService

_auth_service = AuthService()


async def get_current_user(authorization: str | None = Header(default=None)) -> UserInfo:
    settings = get_settings()
    if not settings.auth_required:
        return UserInfo(sub="demo", email="demo@local", name="Demo Traveler")

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = authorization.removeprefix("Bearer ").strip()
    try:
        return _auth_service.verify_google_token(token)
    except AuthError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
