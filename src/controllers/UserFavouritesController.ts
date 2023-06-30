
import { Request, Response } from "express";
import { clearFavourites, find, pushFavorites, removeFavorites } from "../db/dbUsers";

export default class UserFavourites {
    public static readonly addCity = async ({params}: Request, res: Response) => {
        try{
            const resDB = await pushFavorites(res.locals.user.email, params.city);
            if(!resDB) res.status(409).json({message: "already existing city"});
            else res.status(201).json({message: "city successfully added"});
        } catch(e: any){
            res.status(500).json({message: e.message});
        }
    };

    public static readonly getCity = async (_: Request, res: Response) => {
        try{
            const user = await find(res.locals.user.email);
            if(user) res.status(200).json(user.cityFavourites);
        } catch(e: any){
            res.status(500).json({message: e.message});
        }
    };

    public static readonly clearList = async (_: Request, res: Response) => {
        try{
            if(!(await clearFavourites(res.locals.user.email))) res.status(400).json({message: "List is already empty"});
            else res.status(200).json({message: "List emptied successfully"});
        } catch(e: any){
            res.status(500).json({message: e.message});
        }
    }

    public static readonly deleteCity = async ({params}: Request, res: Response) => {
        try{
            const resDB = await removeFavorites(res.locals.user.email, params.city);
            if(!resDB) res.status(404).json({message: "city not found"});
            else res.status(200).json({message: "city successfully deleted"});
        } catch(e: any){
            res.status(500).json({message: e.message});
        }
    };
}