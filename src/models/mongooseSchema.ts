
import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    age: {type: Number, required: true},
    email: {type: String, unique: true, required: true},
    gender: {type: String, required: true},
    password: {type: String, required: true},
    cityFavourites: {type: Array<string>, required: true},
    verify: String
}, {versionKey: false});

export const UserDB = mongoose.model("user", UserSchema);

export type User = {
    id: string,
    email: string,
    username: string,
    age: number,
    gender: string,
    password: string,
    cityFavourites: string[],
    verify?: string,
    accessToken?: string,
    refreshToken?: string
}