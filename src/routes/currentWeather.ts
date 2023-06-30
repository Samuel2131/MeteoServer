
import express from "express";
import { param } from "express-validator";
import Weather from "../controllers/WeatherController";
import { showErrors } from "../middlewares/showErrors";

const router = express.Router();

router.get("/:city", 
    param("city").isString().not().isEmpty(), 
    showErrors, 
    Weather.CurrentWeather
);

export default router;