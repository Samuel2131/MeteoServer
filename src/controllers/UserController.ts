
import { v4 as uuidv4 } from "uuid";
import bycript from "bcrypt";
import { find, findWithVerify, insertUser, isIn, replaceOne } from "../db/dbUsers";
import { Request, Response } from "express";
import { convertToken, getRefreshToken, getToken, getUserFromSignup, getUserFromValidate, saltRounds } from "../utils/utils";
import { sendEmail } from "../utils/utilsEmail";

export default class Users {
    public static readonly signup = async ({ body }: Request, res: Response) => {
        body.password = await bycript.hash(body.password, saltRounds);
        body.verify = uuidv4();

        body.cityFavorites = [];

        const {code: checkCode } = await find(body.email);
        if(checkCode === 500) return res.status(500).json({message: "server error..."});
        if(checkCode === 200) return res.status(409).json({message: "Insert err..."});

        const {code, payload} = await insertUser(body);
        if(code === 500) return res.status(code).json({message: "server error..."});
        if(payload && payload.verify) {
            if(!(await sendEmail(payload.email, payload.verify))) return res.status(500).json({message: "Unable to send validation email"});
        }
        res.status(code).json(getUserFromSignup(payload!));
    };

    public static readonly validate = async ({params}: Request, res: Response) => {
        const {code, payload} = await findWithVerify(params.token);
        if(code === 500) return res.status(code).json({message: "server error..."});
        if(!payload) res.status(code).json({message: "user not found..."});
        else {
            const verify = payload.verify;
            if((await replaceOne(verify as string, getUserFromValidate(payload))).code === 500) return res.status(500).json({message: "server error..."});
            res.json({message: "confirmed user"});
        }
    };

    public static readonly login = async ({body}: Request, res:  Response) => {
        const {code, payload} = await find(body.email);
        if(code === 500) return res.status(code).json({message: "server error..."});
        if(!payload || payload.verify) res.status(404).json({message: "user not found..."});
        else if(!await bycript.compare(body.password, payload.password)) res.status(401).json({message: "wrong credentials..."});
        else { 
            const userWithoutPassword = {
                id: payload.id,
                email: payload.email,
                username: payload.username,
                cityFavourites: [],
                token: "",
                refreshToken: ""
            };
            userWithoutPassword.token = getToken(payload);
            userWithoutPassword.refreshToken = getRefreshToken(payload);
            res.json(userWithoutPassword);
        }
    };

    public static readonly me = async ({headers}: Request, res: Response) => {
        try{
            const JwtPayload: any = convertToken(headers.authorization!);
            const {code, payload} = await find(JwtPayload!.email);
            if(payload){
                if(!isIn(payload.email)) return res.status(401).json({message: "not autorizhed"});
                res.json({
                    id: payload.id,
                    username: payload.username,
                    cityFavorites: payload.cityFavourites,
                    email: payload.email
                });
            }
            else return res.status(code).json({message: "server error..."});
        } catch(err: any) {
            res.status(401).json({message: err.message});
        }
    };

    public static readonly reauthorization = async ({headers}: Request, res: Response) => {
        try{
            const JwtPayload: any = convertToken(headers.authorization!);
            const {code, payload} = await find(JwtPayload!.email);
            if(payload){
                if(!isIn(payload.email)) return res.status(401).json({message: "not autorizhed"});
                res.json({
                    token: getToken(payload),
                    refreshToken: getToken(payload)
                });
            }
            else return res.status(code).json({message: "server error..."});
        } catch(e: any) {
            res.status(401).json({message: e.message});
        }
    };
}
