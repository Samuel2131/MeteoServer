
import { Request, Response } from "express";
import { clearFavourites, find, pushFavorites, removeFavorites } from "../db/dbUsers";
import { ResponseErrorBadRequest, ResponseErrorConflict, ResponseErrorInternal, ResponseErrorNotFound, ResponseSuccessJson } from "../utils/responseUtils";

export default class UserFavourites {
    public static readonly addCity = async ({params}: Request, res: Response) => {
        try{
            const resDB = await pushFavorites(res.locals.user.email, params.city);
            if(!resDB) return ResponseErrorConflict("already existing city");
            else return ResponseSuccessJson({message: "city successfully added"}, 201);
        } catch(e: any){
            return ResponseErrorInternal(e.message);
        }
    };

    public static readonly getCity = async (_: Request, res: Response) => {
        try{
            const user = await find(res.locals.user.email);
            if(user) return ResponseSuccessJson(user.cityFavourites);
        } catch(e: any){
            return ResponseErrorInternal(e.message);
        }
    };

    public static readonly clearList = async (_: Request, res: Response) => {
        try{
            if(!(await clearFavourites(res.locals.user.email))) return ResponseErrorBadRequest(undefined, 400, "List is already empty");
            else return ResponseSuccessJson("List emptied successfully");
        } catch(e: any){
            return ResponseErrorInternal(e.message);
        }
    };

    public static readonly deleteCity = async ({params}: Request, res: Response) => {
        try{
            const resDB = await removeFavorites(res.locals.user.email, params.city);
            if(!resDB) return ResponseErrorNotFound("city not found");
            else return ResponseSuccessJson({message: "city successfully deleted"});
        } catch(e: any){
            return ResponseErrorInternal(e.message);
        }
    };
}