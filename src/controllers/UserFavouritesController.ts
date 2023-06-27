
import { Request, Response } from "express";
import { find, pushFavorites, removeFavorites } from "../db/dbUsers";

export default class UserFavourites {
    public static readonly addCity = async ({params}: Request, res: Response) => {
        try{
            const { message: {code, text} } = await pushFavorites(res.locals.user.email, params.city);
            if(code === 201) res.status(code).json({message: text});
            else if(code === 409) res.status(code).json({message: text});
            else if(code === 500) res.status(code).json({message: text});
        } catch(e){
            res.status(500).json({message: "server error"});
        }
    };

    public static readonly getCity = async (_: Request, res: Response) => {
        try{
            const {message: {code}, payload} = await find(res.locals.user.email);
            payload?.cityFavourites.sort();
            if(payload) res.status(code).json(payload.cityFavourites);
        } catch(e){
            res.status(500).json({message: "server error"});
        }
    };

    public static readonly deleteCity = async ({params}: Request, res: Response) => {
        try{
            const { message: {code, text} } = await removeFavorites(res.locals.user.email, params.city);
            if(code === 200) res.status(code).json({message: text});
            else if(code === 404) res.status(code).json({message: text});
            else if(code === 500) res.status(code).json({message: text});
        } catch(e){
            res.status(500).json({message: "server error"});
        }
    };
}