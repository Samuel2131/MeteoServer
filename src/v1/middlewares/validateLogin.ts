
import { body } from "express-validator";

export const validateLogin = [
    body("email").notEmpty().isString().isEmail(), 
    body("password").notEmpty().isString(), 
];