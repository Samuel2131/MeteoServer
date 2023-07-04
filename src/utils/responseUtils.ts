
import { Request, Response, NextFunction } from "express";
import { 
    IResponseErrorAuthorization, 
    IResponseErrorBadRequest, 
    IResponseErrorConflict, 
    IResponseErrorForbidden, 
    IResponseErrorInternal, 
    IResponseErrorNotFound, 
    IResponseSuccessJson } from "../typings/responses";
import { expressHandler, handlerReturn } from "../models/expressHandlerType";

export const toExpressHandler = <T>(handler: expressHandler<T>): handlerReturn => {
    return (req: Request, res: Response, next: NextFunction) =>
        handler(req, res, next).then((response) => {
            response?.apply(res);
        });
};

export const ResponseErrorInternal = (error?: any, status = 500, message = "Internal Server Error"): IResponseErrorInternal => {
    console.error(error);//
    return {
        apply: (res: Response) => res.status(status).json({ message, error }),
        kind: "ResponseErrorInternal",
        status,
        value: error,
    };
};

export const ResponseErrorBadRequest = (errors?: string[] | Record<string, any>, status = 400, message = "Bad Request"): IResponseErrorBadRequest => ({
    apply: (res) => res.status(status).json({ message, errors }),
    kind: "ResponseErrorBadRequest",
    status,
    value: errors,
});

export const ResponseErrorAuthorization = (error?: string, status = 401, message = "Not Authorized"): IResponseErrorAuthorization => ({
    apply: (res) => res.status(status).json({ message, error }),
    kind: "ResponseErrorAuthorization",
    status,
    value: error,
});

export const ResponseErrorForbidden = (message = "Forbidden", error?: string, status = 403): IResponseErrorForbidden => ({
    apply: (res) => res.status(status).json({ message, error }),
    kind: "ResponseErrorForbidden",
    status,
    value: error,
});

export const ResponseErrorNotFound = (message = "Document Not Found", status = 404, error?: string): IResponseErrorNotFound => ({
    apply: (res) => res.status(status).json({ message, error }),
    kind: "ResponseErrorNotFound",
    status: 404,
    value: error,
});

export const ResponseErrorConflict = (message = "Conflict", status = 409, error?: string, errors?: Record<string, string>[]): IResponseErrorConflict => ({
    apply: (res) => res.status(status).json(errors ? errors : { message, error }),
    kind: "ResponseErrorConflict",
    status,
    value: error,
});

export const ResponseSuccessJson = <T>(value: T, status = 200): IResponseSuccessJson<T> => ({
    apply: (res) => res.status(status).json(value),
    kind: "ResponseSuccessJson",
    status,
    value,
});