
import { param } from "express-validator";
import { isValidCity } from "./isValidCity";

export const validateCity = [
    param("city").isString(), 
    isValidCity,
];