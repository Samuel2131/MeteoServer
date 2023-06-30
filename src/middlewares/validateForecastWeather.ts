
import { param, query } from "express-validator";

export const validateForecastWeather = [
    param("city").isString().not().isEmpty(), 
    query("limit").optional().isFloat({min: 1, max: 6}),
];