class AppError(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class GeminiError(AppError):
    def __init__(self, message: str, status_code: int = 502):
        super().__init__(message, status_code)


class ValidationError(AppError):
    def __init__(self, message: str):
        super().__init__(message, status_code=422)


class AuthError(AppError):
    def __init__(self, message: str = "Authentication required"):
        super().__init__(message, status_code=401)
