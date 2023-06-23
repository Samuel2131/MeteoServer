
import { Request, Response } from "express";
import { sshKey } from "../utils/utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import { find, pushFavorites, removeFavorites } from "../db/dbUsers";

export default class UserFavourites {
    public static readonly addCity = async ({params, headers}: Request, res: Response) => {
        try{
            const user = (await jwt.verify(headers.authorization as string, sshKey)) as JwtPayload;
            const status = await pushFavorites(user.email, params.city);
            if(status === 201) res.status(status).json({message: "City successfully added"});
            else if(status === 409) res.status(status).json({message: "City already present..."});
            else if(status === 500) res.status(status).json({message: "server error"});
        } catch(e){
            res.status(500).json({message: "server error"});
        }
    };

    public static readonly getCity = async ({headers}: Request, res: Response) => {
        try{
            const jwtObj = (await jwt.verify(headers.authorization as string, sshKey)) as JwtPayload;
            const user = await find(jwtObj.email);
            if(user && typeof user !== "number") res.status(200).json(user.cityFavourites);
        } catch(e){
            res.status(500).json({message: "server error"});
        }
    };

    public static readonly deleteCity = async ({params, headers}: Request, res: Response) => {
        try{
            const user = (await jwt.verify(headers.authorization as string, sshKey)) as JwtPayload;
            const status = await removeFavorites(user.email, params.city);
            if(status === 200) res.status(status).json({message: "City successfully deleted"});
            else if(status === 404) res.status(status).json({message: "City not present..."});
            else if(status === 500) res.status(status).json({message: "server error"});
        } catch(e){
            res.status(500).json({message: "server error"});
        }
    };
}