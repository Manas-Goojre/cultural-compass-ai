import logging

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

from app.config import Settings, get_settings
from app.core.errors import AuthError
from app.models.auth import UserInfo

logger = logging.getLogger(__name__)


class AuthService:
    def __init__(self, settings: Settings | None = None):
        self.settings = settings or get_settings()

    def verify_google_token(self, credential: str) -> UserInfo:
        if not self.settings.google_client_id:
            raise AuthError("GOOGLE_CLIENT_ID is not configured on the server")

        try:
            idinfo = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                self.settings.google_client_id,
            )
        except ValueError as exc:
            logger.warning("Google token verification failed: %s", exc)
            raise AuthError("Invalid Google credential") from exc

        if idinfo.get("iss") not in {"accounts.google.com", "https://accounts.google.com"}:
            raise AuthError("Invalid token issuer")

        return UserInfo(
            sub=idinfo["sub"],
            email=idinfo.get("email", ""),
            name=idinfo.get("name", "Traveler"),
            picture=idinfo.get("picture"),
        )
