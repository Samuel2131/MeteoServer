
import { v4 as uuidv4 } from "uuid";
import bycript from "bcrypt";
import { find, findWithVerify, getAll, insertUser, replaceOne, replaceOneWithEmail } from "../db/dbUsers";
import { Request, Response } from "express";
import { convertToken, getRefreshToken, getAccessToken, getUserFromSignup, getUserFromValidate, saltRounds } from "../utils/utils";
import { sendEmail } from "../utils/utilsEmail";
import { ResponseErrorAuthorization, ResponseErrorConflict, ResponseErrorForbidden, ResponseErrorInternal, ResponseErrorNotFound, ResponseSuccessJson } from "../utils/responseUtils";

export default class Users {

    public static readonly getAll = async () => {
        try{
            const users = await getAll();
            return ResponseSuccessJson(users.filter((user) => !user.verify).map((user) => ({
                username: user.username, 
                email: user.email, 
                age: user.age, 
                gender: user.gender, 
                cityFavourites: 
                user.cityFavourites
            })));
        } catch(e: any) {
            return ResponseErrorInternal(e.message);
        }
    };

    public static readonly signup = async ({ body }: Request) => {
        try{
            const user = await find(body.email);
            if(user) return ResponseErrorConflict("Email already used...");

            body.password = await bycript.hash(body.password, saltRounds);
            body.verify = uuidv4();

            body.cityFavorites = [];

            const newUser = await insertUser(body);
            await sendEmail(newUser.email, newUser.verify!);
            return ResponseSuccessJson(getUserFromSignup(newUser), 201);
        } catch(e: any) {
            return ResponseErrorInternal(e.message);
        }
    };

    public static readonly validate = async ({params}: Request) => {
        try{
            const user = await findWithVerify(params.token);
            if(!user) return ResponseErrorNotFound("user not found...");
            else {
                const verify = user.verify;
                await replaceOne(verify as string, getUserFromValidate(user));
                return ResponseSuccessJson({message: "confirmed user"});
            }
        } catch(e: any) {
            return ResponseErrorInternal(e.message);
        }
    };

    public static readonly login = async ({body}: Request) => {
        try{
            const user = await find(body.email);
            if(!user) return ResponseErrorNotFound("user not found...");
            else if(user.verify){
                await sendEmail(user.email, user.verify!);
                return ResponseErrorAuthorization("unverified user...");
            }
            else if(!await bycript.compare(body.password, user.password)) return ResponseErrorAuthorization("wrong credentials...");
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
                return ResponseSuccessJson({userDate: userWithoutPassword, creationDate: user.createdAt.toDateString()});
            }
        } catch(e: any) {
            console.log(e);
            return ResponseErrorInternal(e.message);
        }
    };

    public static readonly me = async ({headers}: Request) => {
        try{
            const JwtPayload: any = convertToken(headers.authorization!);
            if(!JwtPayload.email) return ResponseErrorAuthorization(JwtPayload.message);
            const user = await find(JwtPayload.email);
            if(user){
                return ResponseSuccessJson({
                    username: user.username,
                    cityFavorites: user.cityFavourites,
                    email: user.email,
                    age: user.age,
                    gender: user.gender
                });
            }
            else return ResponseErrorAuthorization("not authorized...");
        } catch(e: any) {
            return ResponseErrorInternal(e.message);
        }
    };

    public static readonly reauthorization = async ({headers}: Request) => {
        try{
            const JwtPayload: any = convertToken(headers.refreshtoken!);
            if(!JwtPayload.email) return ResponseErrorForbidden(JwtPayload.message);
            const user = await find(JwtPayload.email);
            if(user){
                return ResponseSuccessJson({
                    accessToken: getAccessToken(user),
                    refreshToken: getAccessToken(user)
                });
            }
            else return ResponseErrorForbidden("access denied...");
        } catch(e: any) {
            return ResponseErrorInternal(e.message);
        }
    };

    public static readonly updateUser = async ({body}: Request, res: Response) => {
        try{
            const userToReplace = await find(res.locals.user.email);
            const userToCheckNewEmail = await find(body.email);
            if(!userToReplace) return ResponseErrorNotFound("User not found");
            if(userToCheckNewEmail && userToReplace.id !== userToCheckNewEmail.id) return ResponseErrorConflict("Email already used...");

            body.password = await bycript.hash(body.password, saltRounds);
            body.cityFavorites = [];

            await replaceOneWithEmail(userToReplace.email, body);
            return ResponseSuccessJson({message: "Successfully updated user"});
        } catch(e: any) {
            return ResponseErrorInternal(e.message);
        }
    };
}