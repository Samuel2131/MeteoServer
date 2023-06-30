
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload }  from "jsonwebtoken";
import { sshKey } from "../utils/utils";
import { isIn } from "../db/dbUsers";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    try{
        const user = (jwt.verify(req.headers.authorization as string, sshKey)) as JwtPayload;
        res.locals.user = user;
        if(!isIn(user.email)) return res.status(401).json({message: "not autorizhed"});
        else next();
    } catch (e: any){
        if(req.headers.refreshtoken){
            try{
                const user = (jwt.verify(req.headers.refreshtoken as string, sshKey)) as JwtPayload;
                res.locals.user = user;
                if(!isIn(user.email)) return res.status(401).json({message: "not autorizhed"});
                else next();
            } catch(e: any) {
                return res.status(401).json({message: e.message});
            }
        }
        else res.status(401).json({message: e.message});
    }
};