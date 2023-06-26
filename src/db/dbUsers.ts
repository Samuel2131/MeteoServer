
import { ResponseArrayDB, ResponseDB } from "../models/ResponseDBType";
import { UserDB, User } from "../models/mongooseSchema";
import { getUserFromDocument } from "../utils/utils";

export const insertUser = async (newObj: User): Promise<ResponseDB> => {
    try{
        const user = new UserDB(newObj);
        await user.save();
        return {code: 201, payload: getUserFromDocument(user)};
    } catch(e: any) {
        return {code: 500, payload: null};
    }
};

export const getAll = async (): Promise<ResponseArrayDB> => {
    try{
        const users = await UserDB.find({});
        return {code: 200, payload: Array.from({length: users.length}, (index: number) => getUserFromDocument(users[index]))};
    } catch (err) {
        return {code: 500, payload: null};
    }
};

export const replaceOne = async (filter: string, newUser: User): Promise<ResponseDB> => {
    try {
        await UserDB.replaceOne({verify: filter}, newUser);
        return {code: 200, payload: null};
    } catch (err) {
        return {code: 500, payload: null};
    }
};

export const pushFavorites = async (filter: string, element: string): Promise<ResponseDB> => {
    try{
        return {code: (await UserDB.updateOne(({email: filter}), {$addToSet: {cityFavourites: element}})).modifiedCount ? 201 : 409, payload: null};
    }catch(e: unknown) {
        return {code: 500, payload: null};
    }
};

export const removeFavorites = async (filter: string, element: string): Promise<ResponseDB> => {
    try{
        return {code: (await UserDB.updateOne(({email: filter}), {$pull: {cityFavourites: element}})).modifiedCount ? 200 : 404, payload: null};
    }catch(err) {
        return {code: 500, payload: null};
    }
};

export const find = async (email: string): Promise<ResponseDB> => {
    try{
        const user = await UserDB.findOne({email: email});
        return {code: user ? 200 : 404, payload: user ? getUserFromDocument(user) : null};
    } catch(e: any) {
        return {code: 500, payload: null};
    }
};

export const findWithVerify = async (verify: string): Promise<ResponseDB> => {
    try{
        const user = await UserDB.findOne({verify: verify});
        return {code: user ? 200 : 404, payload: user ? getUserFromDocument(user) : null};
    } catch(e: any) {
        return {code: 500, payload: null};
    }
};

export const isIn = async (userEmail: string): Promise<ResponseArrayDB> => {
    const res = await getAll();
    if(res.code === 200) return {code: (res.payload!).some(({email}) => email === userEmail) ? 200 : 404, payload: null};
    return {code: 500, payload: null};
};

export const dropUserDB = async () => {
    try {
        await UserDB.deleteMany({});
    } catch (err){
        console.error(err);
    }
};