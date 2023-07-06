
import { UpdateWriteOpResult } from "mongoose";
import { UserDB, User } from "../models/mongooseSchema";

export const insertUser = async (newObj: User) => {
    const user = new UserDB(newObj);
    return await user.save();
};

export const find = async (email: string) => {
    return await UserDB.findOne({email: email});
};

export const replaceOne = async (filter: string, newUser: User): Promise<UpdateWriteOpResult> => {
    return await UserDB.replaceOne({verify: filter}, newUser);
};

export const replaceOneWithEmail = async (email: string, newUser: User): Promise<UpdateWriteOpResult> => {
    return await UserDB.replaceOne({email: email}, newUser);
};

export const findCity = async (filter: string, city: string): Promise<number> => {
    return (await UserDB.find({email: filter, cityFavourites: {$in : [city]}})).length;
};

export const pushFavorites = async (filter: string, element: string): Promise<UpdateWriteOpResult> => {
    return await UserDB.updateOne(({email: filter}), {$addToSet: {cityFavourites: element}});
};

export const clearFavorites = async (filter: string): Promise<UpdateWriteOpResult> => {
    return await UserDB.updateOne(({email: filter}), {$set: {cityFavourites: []}});
};

export const removeFavorites = async (filter: string, element: string): Promise<UpdateWriteOpResult> => {
    return await UserDB.updateOne(({email: filter}), {$pull: {cityFavourites: element}});
};

export const getCityFavoritesLength = async (filter: string): Promise<number> => {
    const user = await find(filter);
    const aggregateArrayLength = await UserDB.aggregate([{$project: {arrayLength: {$size: "$cityFavourites"}}}]);
    return aggregateArrayLength.filter((res) => res._id.equals(user?._id))[0].arrayLength;
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