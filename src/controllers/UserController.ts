
import { v4 as uuidv4 } from "uuid";
import bycript from "bcrypt";
import { find, findWithVerify, insertUser, isIn, replaceOne } from "../db/dbUsers";
import { Request, Response } from "express";
import { convertToken, getToken, saltRounds } from "../utils/utils";

export default class Users {
    public static readonly signup = async ({ body }: Request, res: Response) => {
        body.password = await bycript.hash(body.password, saltRounds);
        body.verify = uuidv4();

        body.cityFavorites = [];

        const user = await insertUser(body);
        if(user === 500) return res.status(500).json({message: "server error..."});
        if(user === 409) return res.status(409).json({message: "Insert err..."});
        if(typeof user !== "number") res.status(201).json({id: user.id, email: user.email, username: user.username ,favorites: user.cityFavourites, verify: user.verify});
    };

    public static readonly validate = async ({params}: Request, res: Response) => {
        const user = await findWithVerify(params.token);
        if(typeof user === "number") return res.status(500).json({message: "server error..."});
        if(!user) res.status(404).json({message: "user not found..."});
        else {
            const verify = user.verify;
            if(!await replaceOne(verify as string, {id: user.id, cityFavourites: [], username: user.username, email: user.email, password: user.password})) return res.status(500).json({message: "server error..."});
            res.json({message: "confirmed user"});
        }
    };

    public static readonly login = async ({body}: Request, res:  Response) => {
        const user = await find(body.email);
        if(typeof user === "number") return res.status(500).json({message: "server error..."});
        if(!user || user.verify) res.status(404).json({message: "user not found..."});
        else if(!await bycript.compare(body.password, user.password)) res.status(401).json({message: "wrong credentials..."});
        else { 
            const userWithoutPassword = {
                id: user.id,
                email: user.email,
                username: user.username,
                cityFavourites: [],
                token: "",
                refreshToken: ""
            };
            userWithoutPassword.token = getToken(user);
            userWithoutPassword.refreshToken = getToken(user);
            res.json(userWithoutPassword);
        }
    };

    public static readonly me = async ({headers}: Request, res: Response) => {
        try{
            const JwtPayload: any = convertToken(headers.authorization!);
            const user = await find(JwtPayload!.email);
            if(user && typeof user !== "number"){
                if(!isIn(user.email)) return res.status(401).json({message: "not autorizhed"});
                res.json({
                    id: user.id,
                    username: user.username,
                    cityFavorites: user.cityFavourites,
                    email: user.email
                });
            }
            else return res.status(500).json({message: "server error..."});
        } catch(err: any) {
            res.status(401).json({message: err.message});
        }
    };

    public static readonly reauthorization = async ({headers}: Request, res: Response) => {
        try{
            const JwtPayload: any = convertToken(headers.authorization!);
            const user = await find(JwtPayload!.email);
            if(user && typeof user !== "number"){
                if(!isIn(user.email)) return res.status(401).json({message: "not autorizhed"});
                res.json({
                    token: getToken(user),
                    refreshToken: getToken(user)
                });
            }
            else return res.status(500).json({message: "server error..."});
        } catch(e: any) {
            res.status(401).json({message: e.message});
        }
    };
}

