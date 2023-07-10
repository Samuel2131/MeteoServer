
import express from "express";
import { header } from "express-validator";
import Users from "../../controllers/UserController";
import { showErrors } from "../middlewares/showErrors";
import { isAuth } from "../middlewares/isAuth";
import { validateUserBody } from "../middlewares/validateUserBody";
import { validateLogin } from "../middlewares/validateLogin";
import { toExpressHandler } from "../../utils/responseUtils";

const router = express.Router();

router.post("/signup", 
    validateUserBody,
    showErrors, 
    toExpressHandler(Users.signup)
);

router.post("/login", 
    validateLogin,
    showErrors, 
    toExpressHandler(Users.login)
);

router.get("/validate/:token", 
    toExpressHandler(Users.validate)
);

router.get("/me", 
    header("authorization").isJWT(), 
    showErrors, 
    toExpressHandler(Users.me)
);

router.get("/reauthorization", 
    header("refreshtoken").isJWT(), 
    showErrors, 
    toExpressHandler(Users.reauthorization)
);

router.get("/",
    header("authorization").isJWT(),
    isAuth,
    showErrors,
    toExpressHandler(Users.getAll)
);

router.put("/",
    header("authorization").isJWT(),
    isAuth,
    validateUserBody,
    showErrors,
    toExpressHandler(Users.updateUser)
);

router.delete("/",
    header("authorization").isJWT(),
    isAuth,
    showErrors,
    toExpressHandler(Users.deleteUser)
);

export default router;