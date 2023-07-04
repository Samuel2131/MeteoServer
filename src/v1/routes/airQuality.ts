
import express from "express";
import { param } from "express-validator";
import Weather from "../../controllers/WeatherController";
import { showErrors } from "../middlewares/showErrors";
import { toExpressHandler } from "../../utils/responseUtils";

const router = express.Router();

router.get("/:city", 
    param("city").isString().not().isEmpty(), 
    showErrors, 
    toExpressHandler(Weather.AirQuality)
);

export default router;