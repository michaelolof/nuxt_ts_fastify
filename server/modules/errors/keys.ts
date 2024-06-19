
export const errs = {
    DefaultErr: { 
        key: "DEFAULT_ERROR", 
        code: 500, 
        friendly: "Error occured. Please try again",
    },
    TypeMismatch: { 
        key: "TYPE_MISMATCH_ERROR", 
        code: 500, 
        friendly: "Error occured. Please try again",
    },
    BadRequest: { 
        key: "BAD_REQUEST_ERROR", 
        code: 400, 
        friendly: "Invalid request. Please try again",
    },
    UnAuthorized: { 
        key: "UNAUTHORIZED_ERROR", 
        code: 401, 
        friendly: "User is not authorized",
    },
    PaymentRequired: { 
        key: "PAYMENT_REQUIRED_ERROR", 
        code: 402, 
        friendly: "More information is required",
    },
    Forbidden: { 
        key: "FORBIDDEN_ERROR", 
        code: 403,
        friendly: "User is not allowed access",
    },
    NotFound: { 
        key: "NOT_FOUND_ERROR", 
        code: 404,
        friendly: "Requested resource was not found",
    },
    MethodNotAllowed: { 
        key: "METHOD_NOT_ALLOWED_ERROR", 
        code: 405,
        friendly: "Request method is not allowed",
    },
    TooManyRequests: { 
        key: "TO_MANY_REQUESTS_ERROR", 
        code: 429,
        friendly: "Too many requests. Please try again after a period of time",
    },
    InternalServer: { 
        key: "INTERNAL_SERVER_ERROR", 
        code: 500,
        friendly: "Something went wrong while getting response. Please try again later",
    },
    NotImplemented: { 
        key: "NOT_IMPLEMENTED_ERROR", 
        code: 501,
        friendly: "Requested feature has not been implemented",
    },
    BadGateway: { 
        key: "BAD_GATEWAY_ERROR", 
        code: 502,
        friendly: "Requested feature has not been implemented",
    },
    ServiceUnavailable: { 
        key: "SERVICE_UNAVAILABLE_ERROR", 
        code: 503,
        friendly: "Requested feature has not been implemented",
    },
    GatewayTimeout: { 
        key: "GATEWAY_TIMEOUT_ERROR", 
        code: 504,
        friendly: "A gateway timeout error occured",
    },
    InsufficientStorage: { 
        key: "INSUFFICIENT_STORAGE_ERROR", 
        code: 507,
        friendly: "Insufficient storage error occured",
    },
    SchemaValidation: { 
        key: "SCHEMA_VALIDATION_ERROR", 
        code: 400,
        friendly: "Error occured while validating your request/response against schema",
    },
    RequestValidation: { 
        key: "REQUEST_VALIDATION_ERROR", 
        code: 400,
        friendly: "Error occured while validating request",
    },
    ResponseValidation: {
        key: "RESPONSE_VALIDATION_ERROR", 
        code: 500,
        friendly: "Error occured while validating response",
    },
    InvalidCredentials: { 
        key: "INVALID_CREDENTIALS_ERROR", 
        code: 400,
        friendly: "We couldn't verify the credentials passed",
    },
    UnknownUser: { 
        key: "UNKNOWN_USER_ERROR", 
        code: 401,
        friendly: "Unknow user detected. Please retry with valid credentials",
    },
    UnhandledRouter: {
        key: "UNHANDLED_ROUTER_ERROR",
        code: 500,
        friendly: "Unhandled router error. Please contact provider",
    },
    UnknowObjectType: {
        key: "UNKNOWN_OBJECT_TYPE_ERROR",
        code: 500,
        friendly: "Unknown error type thrown. Please contact provider",
    },
} as const;


export const fastifyErrorMappings = /** @type {Record<String, import("#dts/errors.js").ErrorKind>}*/ ({
    FST_ERR_NOT_FOUND: errs.NotFound,
    FST_ERR_OPTIONS_NOT_OBJ: errs.InternalServer,
    FST_ERR_QSP_NOT_FN: errs.InternalServer,
    FST_ERR_SCHEMA_CONTROLLER_BUCKET_OPT_NOT_FN: errs.InternalServer,
    FST_ERR_CTP_INVALID_TYPE: errs.BadRequest,
    FST_ERR_CTP_EMPTY_TYPE: errs.BadRequest,
    FST_ERR_VALIDATION: errs.BadRequest,
});