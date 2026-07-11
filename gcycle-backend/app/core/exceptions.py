from app.core.constants import ErrorCode


class AppException(Exception):
    """Base application exception mapped to a consistent error response."""

    status_code: int = 400
    code: str = ErrorCode.VALIDATION_ERROR.value

    def __init__(self, message: str, details: list | None = None):
        self.message = message
        self.details = details or []
        super().__init__(message)


class NotFoundError(AppException):
    status_code = 404
    code = ErrorCode.NOT_FOUND.value


class UnauthorizedError(AppException):
    status_code = 401
    code = ErrorCode.UNAUTHORIZED.value


class ForbiddenError(AppException):
    status_code = 403
    code = ErrorCode.FORBIDDEN.value


class ConflictError(AppException):
    status_code = 409
    code = ErrorCode.CONFLICT.value


class ValidationAppError(AppException):
    status_code = 422
    code = ErrorCode.VALIDATION_ERROR.value
