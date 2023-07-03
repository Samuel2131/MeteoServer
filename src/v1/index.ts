
import { Router } from "express";
import weather from "./routes/currentWeather";
import airQuality from "./routes/airQuality";
import forecastWeather from "./routes/forecastWeather";
import users from "./routes/users";
import userFavorites from "./routes/userFavorites";

const router = Router();

router.use("/currentWeather", weather);
router.use("/airQuality", airQuality);
router.use("/forecastWeather", forecastWeather);
router.use("/users", users);
router.use("/users/favorites", userFavorites);

export default router;