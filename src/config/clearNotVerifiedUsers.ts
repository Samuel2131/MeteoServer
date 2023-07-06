
import { deleteOne, getAll } from "../db/dbUsers";
import { getHours } from "../utils/utils";

export const clearNotVerifiedUsers = async () => {
    const users = await getAll();
    await Promise.all(users.map((user) => {
        try{
            if(user.verify && getHours(new Date(), user.createdAt) >= 24) return deleteOne(user.email);
        } catch(e){
            console.error(e);
        }
    }));
};