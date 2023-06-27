
import { ResponseArrayDB, ResponseDB } from "../models/ResponseDBType";
import { UserDB, User } from "../models/mongooseSchema";
import { getUserFromDocument } from "../utils/utils";

export const insertUser = async (newObj: User): Promise<ResponseDB> => {
    try{
        const user = new UserDB(newObj);
        await user.save();
        return {message: {code: 201}, payload: getUserFromDocument(user)};
    } catch(e: any) {
        return {message: {code: 500, text: e.message}};
    }
};

export const getAll = async (): Promise<ResponseArrayDB> => {
    try{
        const users = await UserDB.find({});
        return {message: {code: 200}, payload: Array.from({length: users.length}, (index: number) => getUserFromDocument(users[index]))};
    } catch (e: any) {
        return {message: {code: 500, text: e.message}};
    }
};

export const replaceOne = async (filter: string, newUser: User): Promise<ResponseDB> => {
    try {
        await UserDB.replaceOne({verify: filter}, newUser);
        return {message: {code: 200}};
    } catch (e: any) {
        return {message: {code: 500, text: e.message}};
    }
};

export const pushFavorites = async (filter: string, element: string): Promise<ResponseDB> => {
    try{
        const resDB = (await UserDB.updateOne(({email: filter}), {$addToSet: {cityFavourites: element}})).modifiedCount;
        return {message: {code: resDB ? 201 : 409, text: resDB ? "City successfully added" : "City already present..."}};
    }catch(e: any) {
        return {message: {code: 500, text: e.message}};
    }
};

export const removeFavorites = async (filter: string, element: string): Promise<ResponseDB> => {
    try{
        const resDB = (await UserDB.updateOne(({email: filter}), {$pull: {cityFavourites: element}})).modifiedCount;
        return {message: {code: resDB ? 200 : 404, text: resDB ? "City successfully deleted" : "City not present..."}};
    }catch(e: any) {
        return {message: {code: 500, text: e.message}};
    }
};

export const find = async (email: string): Promise<ResponseDB> => {
    try{
        const user = await UserDB.findOne({email: email});
        return {message: {code: user ? 200 : 404}, payload: user ? getUserFromDocument(user) : null};
    } catch(e: any) {
        return {message: {code: 500, text: e.message}};
    }
};

export const findWithVerify = async (verify: string): Promise<ResponseDB> => {
    try{
        const user = await UserDB.findOne({verify: verify});
        return {message: {code: user ? 200 : 404}, payload: user ? getUserFromDocument(user) : null};
    } catch(e: any) {
        return {message: {code: 500, text: e.message}};
    }
};

export const isIn = async (userEmail: string): Promise<ResponseArrayDB> => {
    const res = await getAll();
    if(res.message.code === 200) return {message: {code: (res.payload!).some(({email}) => email === userEmail) ? 200 : 404}};
    return {message: {code: 500, text: "server error..."}};
};

export const dropUserDB = async () => {
    try {
        await UserDB.deleteMany({});
    } catch (err){
        console.error(err);
    }
};