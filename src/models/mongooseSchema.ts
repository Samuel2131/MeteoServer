
import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    email: {type:String, unique: true, required: true},
    password: {type:String, required: true},
    username: {type:String, required: true},
    cityFavourites: {type: Array<string>, required: true},
    verify: String
}, {versionKey: false});

export const UserDB = mongoose.model("user", UserSchema);

export type User = {
    id: string,
    email: string,
    username: string,
    password: string,
    cityFavourites: string[],
    verify?: string,
    token?: string,
    refreshToken?: string
}