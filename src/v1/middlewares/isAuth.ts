
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload }  from "jsonwebtoken";
import { isIn } from "../../db/dbUsers";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    try{
        const user = (jwt.verify(req.headers.authorization as string, process.env.SSHKEY!)) as JwtPayload;
        res.locals.user = user;
        if(!isIn(user.email)) return res.status(401).json({message: "not autorizhed"});
        else next();
    } catch (e: any){
       res.status(401).json({message: e.message});
    }
};