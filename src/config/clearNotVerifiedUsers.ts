
import { deleteOne, getAll } from "../db/dbUsers";
import { getHours } from "../utils/utils";

export const clearNotVerifiedUsers = async () => {
    const users = await getAll();
    users.forEach((user) => {
        try{
            if(user.verify && getHours(new Date(), user.createdAt) >= 24) deleteOne(user.email);
        } catch(e){
            console.error(e);
        }
    });
};