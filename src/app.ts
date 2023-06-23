
import express, { json } from "express";
import weather from "./routes/currentWeather";
import airQuality from "./routes/airQuality";
import forecastWeather from "./routes/forecastWeather";
import users from "./routes/users";
import userFavorites from "./routes/userFavorites";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

export const app = express();
app.use(cors());
app.use(json());
app.use("/v1/currentWeather", weather);
app.use("/v1/airQuality", airQuality);
app.use("/v1/forecastWeather", forecastWeather);
app.use("/v1/users", users);
app.use("/v1/users/favorites", userFavorites);

console.log(process.env.VAR);
app.listen(process.env.PORT, async () => {
    console.log("Server is running");
    mongoose.connect(`mongodb+srv://samperisisamuel:${process.env.PASSWORD}@UserDB.yvd6jyw.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`);
});