
import express from "express";
import { body, header } from "express-validator";
import { regexPasswordValidation } from "../utils/utils";
import Users from "../controllers/UserController";
import { showErrors } from "../middlewares/showErrors";
import { isAuth } from "../middlewares/isAuth";

const router = express.Router();

router.post("/signup", 
    body("password").matches(regexPasswordValidation), 
    body("username").notEmpty().isString(), 
    body("email").notEmpty().isString().isEmail(),
    showErrors, 
    Users.signup
);

router.post("/login", 
    body("email").notEmpty().isString().isEmail(), 
    body("password").notEmpty().isString(), 
    showErrors, 
    Users.login
);

router.get("/validate/:token", 
    Users.validate
);

router.get("/me", 
    header("authorization").isJWT(), 
    showErrors, 
    Users.me
);

router.get("/reauthorization", 
    header("refreshtoken").isJWT(), 
    showErrors, 
    Users.reauthorization
);

router.get("/",
    header("authorization").isJWT(),
    isAuth,
    showErrors,
    Users.getAll
);

export default router;