
import { body } from "express-validator";
import { regexPasswordValidation } from "../../utils/utils";

export const validateUserBody = [
    body("password").matches(regexPasswordValidation), 
    body("username").notEmpty().isString(), 
    body("email").notEmpty().isString().isEmail(),
    body("age").notEmpty().isFloat({min: 18}),
    body("gender").notEmpty().isString()
];