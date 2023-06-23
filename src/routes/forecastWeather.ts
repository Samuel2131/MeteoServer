
import express from "express";
import { param, query } from "express-validator";
import { showErrors } from "../utils/utils";
import Weather from "../controllers/WeatherController";

const router = express.Router();

router.get("/:city", 
    param("city").isString().not().isEmpty(), 
    query("limit").optional().isFloat({min: 1, max: 6}), 
    showErrors, 
    Weather.ForecastWeather
);

export default router;