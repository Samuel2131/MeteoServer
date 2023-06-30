
import express from "express";
import { header } from "express-validator";
import Users from "../controllers/UserController";
import { showErrors } from "../middlewares/showErrors";
import { isAuth } from "../middlewares/isAuth";
import { validateSignup } from "../middlewares/validateSignup";
import { validateLogin } from "../middlewares/validateLogin";

const router = express.Router();

router.post("/signup", 
    validateSignup,
    showErrors, 
    Users.signup
);

router.post("/login", 
    validateLogin,
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