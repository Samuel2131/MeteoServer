
import { UpdateWriteOpResult } from "mongoose";
import { UserDB, User } from "../models/mongooseSchema";

export const insertUser = async (newObj: User) => {
    const user = new UserDB(newObj);
    return await user.save();
};

export const replaceOne = async (filter: string, newUser: User): Promise<UpdateWriteOpResult> => {
    return await UserDB.replaceOne({verify: filter}, newUser);
};

export const pushFavorites = async (filter: string, element: string): Promise<number> => {
    return (await UserDB.updateOne(({email: filter}), {$addToSet: {cityFavourites: element}})).modifiedCount;
};

export const clearFavourites = async (filter: string): Promise<number> => {
    return (await UserDB.updateOne(({email: filter}), {$set: {cityFavourites: []}})).modifiedCount;
};

export const removeFavorites = async (filter: string, element: string): Promise<number> => {
    return (await UserDB.updateOne(({email: filter}), {$pull: {cityFavourites: element}})).modifiedCount;
};

export const find = async (email: string) => {
    return await UserDB.findOne({email: email});
};

export const getAll = async () => {
    return await UserDB.find({});
};

export const findWithVerify = async (verify: string) => {
    return await UserDB.findOne({verify: verify});
};

export const isIn = async (userEmail: string): Promise<boolean> => {
    const res = await getAll();
    if(res.length !== 0) return res.some(({email}) => email === userEmail);
    return false;
};

export const deleteOne = async (userEmail: string) => {
    return await UserDB.deleteOne({email: userEmail});
};

export const dropUserDB = async () => {
    try {
        await UserDB.deleteMany({});
    } catch (err){
        console.error(err);
    }
};