
import { v4 as uuidv4 } from "uuid";
import bycript from "bcrypt";
import { find, findWithVerify, getAll, insertUser, replaceOne } from "../db/dbUsers";
import { Request, Response } from "express";
import { convertToken, getRefreshToken, getAccessToken, getUserFromSignup, getUserFromValidate, saltRounds } from "../utils/utils";
import { sendEmail } from "../utils/utilsEmail";

export default class Users {

    public static readonly getAll = async (_: Request, res: Response) => {
        try{
            const users = await getAll();
            res.status(200).json(users.filter((user) => !user.verify).map((user) => ({username: user.username, email: user.email, age: user.age, gender: user.gender, cityFavourites: user.cityFavourites})));
        } catch(e: any) {
            res.status(500).json({message: e.message});
        }
    };

    public static readonly signup = async ({ body }: Request, res: Response) => {
        try{
            const user = await find(body.email);
            if(user) return res.status(409).json({message: "Email already used..."});

            body.password = await bycript.hash(body.password, saltRounds);
            body.verify = uuidv4();

            body.cityFavorites = [];

            const newUser = await insertUser(body);
            await sendEmail(newUser.email, newUser.verify!);
            res.status(201).json(getUserFromSignup(newUser));
        } catch(e: any) {
            res.status(500).json({message: e.message});
        }
    };

    public static readonly validate = async ({params}: Request, res: Response) => {
        try{
            const user = await findWithVerify(params.token);
            if(!user) res.status(404).json({message: "user not found..."});
            else {
                const verify = user.verify;
                await replaceOne(verify as string, getUserFromValidate(user));
                res.json({message: "confirmed user"});
            }
        } catch(e: any) {
            res.status(500).json({message: e.message});
        }
    };

    public static readonly login = async ({body}: Request, res:  Response) => {
        try{
            const user = await find(body.email);
            if(!user || user.verify) res.status(404).json({message: "user not found..."});
            else if(!await bycript.compare(body.password, user.password)) res.status(401).json({message: "wrong credentials..."});
            else { 
                const userWithoutPassword = {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    age: user.age,
                    gender: user.gender,
                    cityFavourites: [],
                    accessToken: "",
                    refreshToken: ""
                };
                userWithoutPassword.accessToken = getAccessToken(user);
                userWithoutPassword.refreshToken = getRefreshToken(user);
                res.json(userWithoutPassword);
            }
        } catch(e: any) {
            res.status(500).json({message: e.message});
        }
    };

    public static readonly me = async ({headers}: Request, res: Response) => {
        try{
            const JwtPayload: any = convertToken(headers.authorization!);
            if(!JwtPayload.email) return res.status(401).json({message: JwtPayload.message});
            const user = await find(JwtPayload.email);
            if(user){
                res.json({
                    username: user.username,
                    cityFavorites: user.cityFavourites,
                    email: user.email,
                    age: user.age,
                    gender: user.gender
                });
            }
            else return res.status(401).json({message: "server error..."});
        } catch(e: any) {
            res.status(500).json({message: e.message});
        }
    };

    public static readonly reauthorization = async ({headers}: Request, res: Response) => {
        try{
            const JwtPayload: any = convertToken(headers.refreshtoken!);
            if(!JwtPayload.email) return res.status(403).json({message: JwtPayload.message});
            const user = await find(JwtPayload.email);
            if(user){
                res.json({
                    accessToken: getAccessToken(user),
                    refreshToken: getAccessToken(user)
                });
            }
            else return res.status(403).json({message: "server error..."});
        } catch(e: any) {
            res.status(500).json({message: e.message});
        }
    };
}