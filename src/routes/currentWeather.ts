
import express from "express";
import { param } from "express-validator";
import { showErrors } from "../utils/utils";
import Weather from "../controllers/WeatherController";

const router = express.Router();

router.get("/:city", 
    param("city").isString().not().isEmpty(), 
    showErrors, 
    Weather.CurrentWeather
);

export default router;