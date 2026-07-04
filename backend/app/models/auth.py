from pydantic import BaseModel


class GoogleAuthRequest(BaseModel):
    credential: str


class UserInfo(BaseModel):
    sub: str
    email: str
    name: str
    picture: str | None = None


class AuthResponse(BaseModel):
    user: UserInfo
    message: str = "Authenticated successfully"
