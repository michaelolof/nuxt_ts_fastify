import { errs, fastifyErrorMappings } from "./keys";
import { AppError, type ErrorKind } from "./types";

export function tryFn<T>(fn: () => T): T | AppError {
    try {
        return fn();
    } catch(e) {
        return parseAppError(e);
    }
}

export function throwFn<T>(fn: () => T | AppError): T {
    try {
        const v = fn();
        if (v instanceof AppError) {
            throw v;
        } else {
            return v;
        }
    } catch (e) {
        console.warn("Function passed to throws shouldn't be throwing error, but returning it");
        throw parseAppError(e);
    }
}

export async function tryAsyncFn<T>(fn: () => Promise<T>): Promise<T | AppError> {
    try {
        return fn();
    } catch(e) {
        return parseAppError(e);
    }
}

export function parseAppError(val: any): AppError {
    
    switch (typeof val) {
        case "string":
            return new AppError(errs.TypeMismatch).withDetail(val);
        case "number":
        case "bigint":
            return new AppError(errs.TypeMismatch).withDetail("Illegal value (number | bigint) was thrown: " + val);
        case "boolean":
            return new AppError(errs.TypeMismatch).withDetail("Illegal value (boolean) was thrown: " + val);
        case "function":
            return new AppError(errs.TypeMismatch).withDetail("Illegal value (function) was thrown as error");
        case "symbol":
            return new AppError(errs.TypeMismatch).withDetail("Illegal value (symbol) was thrown as error");
        case "undefined": return new AppError(errs.TypeMismatch).withDetail("Illegal value (undefined) was thrown as error");
        case "object":
            if (val instanceof AppError) {
                return val;
            } else if (val instanceof Error && "code" in val && typeof val.code === "string" && val.code.startsWith("FST_ERR_")) { // This is FastifyError
                const kind = (fastifyErrorMappings as Record<string, ErrorKind | undefined>)[val.code];
                return new AppError(kind || errs.UnhandledRouter, val.message).withData(kind === undefined ? val.code : undefined);
            } else if (val instanceof Error) {
                return AppError.parseError(val);
            } else if (val === null) {
                return new AppError(errs.TypeMismatch).withDetail("Illegal value (null) was thrown as error");
            } else if (Array.isArray(val)) {
                return new AppError(errs.TypeMismatch).withDetail("Illegal value (array) was thrown: " + JSON.stringify(val));
            } else if ("message" in val && typeof val.message === "string" && "statusCode" in val && typeof val.statusCode === "number") {
                return new AppError(errs.UnknowObjectType, val.message, val.statusCode);
            } else if ("message" in val && typeof val.message === "string") {
                return new AppError(errs.UnknowObjectType, val.message);
            } else {
                return new AppError(errs.TypeMismatch).withDetail("Illegal value (object) was thrown: " + JSON.stringify(val));
            }
        default:
            return new AppError(errs.TypeMismatch).withDetail("Unknown value/object thrown. Unable to parse");
    }
}

export function errorResponse(val: any): ErrorResponse {
    const err = parseAppError(val);
    return {
        status: "error",
        key: err.key,
        message: err.message,
        ts: err.ts,
        data: null,
    };
}


export type ErrorResponse = {
    status: "error";
    key: string;
    ts?: number | undefined;
    message: string;
    data: any;
};