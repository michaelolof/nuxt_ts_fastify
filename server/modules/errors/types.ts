import { errs } from "./keys";

export type ErrorKind = {
    key: string;
    code: number;
    friendly: string;
};

export type ErrorExport = {
    name: string;
    key: string;
    ts: number;
    status_code: number;
    message: string;
    detailed_message: string;
    data: any;
    stack?: string | undefined;
};

export class AppError extends Error {
    detailedMessage = "";
    data: any = undefined;
    ts = Date.now();
    statusCode = 500;
    key = "";

    constructor(kind: ErrorKind, message?: string, code?: number) {
        super(message || kind.friendly);
        this.name = "AppError";
        this.statusCode = code || kind.code;
        this.key = kind.key;
    }

    static parseError(err: Error, msg?: string): AppError {
        if (isStatusError(err)) {
            const e = new AppError(errs.DefaultErr, msg, err.statusCode);
            e.detailedMessage = err.message;
            return e;
        } else {
            const e = new AppError(errs.DefaultErr, msg);
            e.detailedMessage = err.message;
            return e;
        }
    }

    withKey(key: string): AppError {
        this.key = key;
        return this;
    }

    withData(data: any): AppError {
        this.data = data;
        return this;
    }

    withDetail(actualMessage: string): AppError {
        this.detailedMessage = actualMessage;
        return this;
    }

    toJSON(): ErrorExport {
        return {
            name: this.name,
            key: this.key,
            ts: this.ts,
            status_code: this.statusCode,
            message: this.message,
            detailed_message: this.detailedMessage,
            data: this.data,
            stack: this.stack,
        };
    }
}

export function isStatusError(err: any): err is { statusCode: number } {
    return typeof err == "object" && err.statusCode && typeof err.statusCode === "number";
}