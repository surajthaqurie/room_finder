export enum ErrorType {
    BAD_TOKEN = "BadTokenError",
    TOKEN_EXPIRED = "TokenExpiredError",
    UNAUTHORIZED = "AuthFailureError",
    ACCESS_TOKEN = "AccessTokenError",
    INTERNAL = "InternalError",
    NOT_FOUND = "NotFoundError",
    NO_ENTRY = "NoEntryError",
    NO_DATA = "NoDataError",
    BAD_REQUEST = "BadRequestError",
    FORBIDDEN = "ForbiddenError",
    CONFLICT_REQUEST = "ConflictRequestError",
    PRISMA_CLIENT_KNOWN_REQUEST_ERROR = "PrismaClientKnownRequestError"
}
