
import { NextFunction, Request, Response } from "express";
import { IResponse } from "../typings/responses";

export type expressHandler<T> = (req: Request, res: Response, next: NextFunction) => Promise<IResponse<T> | void>;

export type handlerReturn = ((req: Request, res: Response, next: NextFunction) => void);