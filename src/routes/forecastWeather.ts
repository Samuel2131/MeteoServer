
import express from "express";
import { param, query } from "express-validator";
import Weather from "../controllers/WeatherController";
import { showErrors } from "../middlewares/showErrors";

const router = express.Router();

router.get("/:city", 
    param("city").isString().not().isEmpty(), 
    query("limit").optional().isFloat({min: 1, max: 6}), 
    showErrors, 
    Weather.ForecastWeather
);

export default router;