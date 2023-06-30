
import "dotenv/config";
import mongoose from "mongoose";

const dbUrl = `mongodb+srv://samperisisamuel:${process.env.PASSWORD}@UserDB.yvd6jyw.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;

export const dbConnection = () => {
    mongoose.connect(dbUrl, {
        serverSelectionTimeoutMS: 15000,
    });
};