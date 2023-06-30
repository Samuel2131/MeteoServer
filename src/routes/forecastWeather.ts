
import express from "express";
import Weather from "../controllers/WeatherController";
import { showErrors } from "../middlewares/showErrors";
import { validateForecastWeather } from "../middlewares/validateForecastWeather";

const router = express.Router();

router.get("/:city", 
    validateForecastWeather,
    showErrors, 
    Weather.ForecastWeather
);

export default router;