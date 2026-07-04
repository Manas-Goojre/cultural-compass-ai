from fastapi import APIRouter, HTTPException

from app.core.errors import AuthError
from app.models.auth import AuthResponse, GoogleAuthRequest
from app.services.auth_service import AuthService

router = APIRouter(prefix="/api/auth", tags=["auth"])
auth_service = AuthService()


@router.post("/google", response_model=AuthResponse)
def google_auth(body: GoogleAuthRequest):
    try:
        user = auth_service.verify_google_token(body.credential)
        return AuthResponse(user=user)
    except AuthError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc
