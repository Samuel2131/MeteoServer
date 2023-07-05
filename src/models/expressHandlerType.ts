
import { NextFunction, Request, Response } from "express";
import { IResponse } from "../typings/responses";

export type ExpressHandler<T> = (req: Request, res: Response, next: NextFunction) => Promise<IResponse<T> | void>;

export type HandlerReturn = ((req: Request, res: Response, next: NextFunction) => void);