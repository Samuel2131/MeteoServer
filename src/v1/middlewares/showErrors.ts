
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";


export const showErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array();
    if(errors.length !== 0 && errors[0].location === "headers"){
        if(errors[0].param === "authorization") return res.status(401).json({errors});
        else if(errors[0].param === "refreshtoken") return res.status(403).json({errors});
    }
    validationResult(req).isEmpty() ? next() : res.status(400).json({errors});
};