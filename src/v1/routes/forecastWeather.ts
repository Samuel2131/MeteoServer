
import express from "express";
import Weather from "../../controllers/WeatherController";
import { showErrors } from "../middlewares/showErrors";
import { validateForecastWeather } from "../middlewares/validateForecastWeather";
import { toExpressHandler } from "../../utils/responseUtils";

const router = express.Router();

router.get("/:city", 
    validateForecastWeather,
    showErrors, 
    toExpressHandler(Weather.ForecastWeather)
);

export default router;