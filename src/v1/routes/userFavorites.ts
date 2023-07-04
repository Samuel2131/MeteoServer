
import express from "express";
import { header } from "express-validator";
import UserFavourites from "../../controllers/UserFavouritesController";
import { showErrors } from "../middlewares/showErrors";
import { isAuth } from "../middlewares/isAuth";
import { validateCity } from "../middlewares/validateCity";
import { toExpressHandler } from "../../utils/responseUtils";

const router = express.Router();

router.post("/:city", 
    header("authorization").isJWT(), 
    isAuth,
    validateCity,
    showErrors, 
    toExpressHandler(UserFavourites.addCity)
);

router.get("/", 
    header("authorization").isJWT(), 
    isAuth,
    showErrors, 
    toExpressHandler(UserFavourites.getCity)
);

router.delete("/",
    header("authorization").isJWT(),
    isAuth,
    showErrors,
    toExpressHandler(UserFavourites.clearList)
);

router.delete("/:city", 
    header("authorization").isJWT(), 
    isAuth,
    validateCity,
    showErrors, 
    toExpressHandler(UserFavourites.deleteCity)
);

export default router;