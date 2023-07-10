
import mongoose from "mongoose";

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
    refreshToken?: string,
    createdAt: number,
    updatedAt: number
}

export const UserSchema = new mongoose.Schema<User>({
    username: {type: String, required: true},
    age: {type: Number, required: true},
    email: {type: String, unique: true, required: true},
    gender: {type: String, required: true},
    password: {type: String, required: true},
    cityFavourites: {type: [String], required: true},
    verify: String
}, {versionKey: false, timestamps: true});

export const UserDB = mongoose.model("user", UserSchema);