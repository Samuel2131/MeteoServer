
import { UserDB, User } from "../models/mongooseSchema";

export const insertUser = async (newObj: User) => {
    try{
        const user = new UserDB(newObj);
        await user.save();
        return user;
    } catch(e: any) {
        if(e.code && e.code === 11000) return 409;
        return 500;
    }
};

export const getAll = async (): Promise<User[] | number> => {
    try{
        return await UserDB.find({});
    } catch (err) {
        return 500;
    }
};

export const replaceOne = async (filter: string, newUser: User): Promise<boolean> => {
    try {
        await UserDB.replaceOne({verify: filter}, newUser);
        return true;
    } catch (err) {
        return false;
    }
};

export const pushFavorites = async (filter: string, element: string): Promise<number> => {
    try{
        return (await UserDB.updateOne(({email: filter}), {$addToSet: {cityFavourites: element}})).modifiedCount ? 201 : 409;
    }catch(e: unknown) {
        return 500;
    }
};

export const removeFavorites = async (filter: string, element: string): Promise<number> => {
    try{
        return (await UserDB.updateOne(({email: filter}), {$pull: {cityFavourites: element}})).modifiedCount ? 200 : 404;
    }catch(err) {
        console.log(err);
        return 500;
    }
};

export const find = async (email: string): Promise<User | null | number> => {
    try{
        return await UserDB.findOne({email: email});
    } catch(e) {
        return 500;
    }
};

export const findWithVerify = async (verify: string): Promise<User | null | number> => {
    try{
        return await UserDB.findOne({verify: verify});
    } catch(e) {
        return 500;
    }
};

export const isIn = async (userEmail: string): Promise<boolean | number> => {
    const users = await getAll();
    if(typeof users !== "number") return (users).some(({email}) => email === userEmail);
    return 500;
};

export const dropUserDB = async () => {
    try {
        await UserDB.deleteMany({});
    } catch (err){
        console.error(err);
    }
};