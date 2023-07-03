
import { NextFunction, Request, Response } from "express";
import { getCurrentWeather } from "../../utils/utilsWeather";

export const isValidCity = async ({params}: Request, res: Response, next: NextFunction) => {
    (await getCurrentWeather(params.city)) ? next() : res.status(400).json({message: "invalid city..."});
};