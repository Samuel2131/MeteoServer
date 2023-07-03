
import { deleteOne, getAll } from "../db/dbUsers";
import { getDay } from "../utils/utils";

export const clearNotVerifiedUsers = async () => {
    const users = await getAll();
    users.forEach((user) => {
        try{
            if(user.verify && getDay(new Date(), user.createdAt) >= 2) deleteOne(user.email);
        } catch(e){
            console.error(e);
        }
    });
};