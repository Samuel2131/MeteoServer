
import { body } from "express-validator";
import { regexPasswordValidation } from "../utils/utils";

export const validateSignup = [
    body("password").matches(regexPasswordValidation), 
    body("username").notEmpty().isString(), 
    body("email").notEmpty().isString().isEmail(),
];