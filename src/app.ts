
import express, { json } from "express";
import weather from "./routes/currentWeather";
import airQuality from "./routes/airQuality";
import forecastWeather from "./routes/forecastWeather";
import users from "./routes/users";
import userFavorites from "./routes/userFavorites";
import cors from "cors";
import "dotenv/config";
import { startServer } from "./config/configServer";

export const app = express();

app.use(cors());
app.use(json());

app.use("/v1/currentWeather", weather);
app.use("/v1/airQuality", airQuality);
app.use("/v1/forecastWeather", forecastWeather);
app.use("/v1/users", users);
app.use("/v1/users/favorites", userFavorites);

app.listen(process.env.PORT, startServer);