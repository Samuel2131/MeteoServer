
import { Response } from "express";

export interface IResponse<T> {
  readonly kind: T;
  readonly status: number;
  readonly apply: (response: Response) => void;
}

export interface IResponseSuccessJson<T> extends IResponse<"ResponseSuccessJson"> {
  value: T;
}

export interface IResponseErrorInternal extends IResponse<"ResponseErrorInternal"> {
  value?: any;
}

export interface IResponseErrorConflict extends IResponse<"ResponseErrorConflict"> {
  value?: string;
}

export interface IResponseErrorBadRequest extends IResponse<"ResponseErrorBadRequest"> {
  value?: string[] | Record<string, any>;
}

export interface IResponseErrorAuthorization extends IResponse<"ResponseErrorAuthorization"> {
  value?: string;
}

export interface IResponseErrorForbidden extends IResponse<"ResponseErrorForbidden"> {
  value?: string;
}

export interface IResponseErrorNotFound extends IResponse<"ResponseErrorNotFound"> {
  value?: string;
}

export interface IResponseErrorUnprocessableEntity
  extends IResponse<"ResponseErrorUnprocessableEntity"> {
  value?: string;
}