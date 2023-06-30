
import express from "express";
import { header, param } from "express-validator";
import UserFavourites from "../controllers/UserFavouritesController";
import { showErrors } from "../middlewares/showErrors";
import { isAuth } from "../middlewares/isAuth";
import { isValidCity } from "../middlewares/isValidCity";

const router = express.Router();

router.post("/:city", 
    header("authorization").isJWT(), 
    isAuth,
    param("city").isString(), 
    isValidCity,
    showErrors, 
    UserFavourites.addCity
);

router.get("/", 
    header("authorization").isJWT(), 
    isAuth,
    showErrors, 
    UserFavourites.getCity
);

router.delete("/",
    header("authorization").isJWT(),
    isAuth,
    showErrors,
    UserFavourites.clearList
);

router.delete("/:city", 
    header("authorization").isJWT(), 
    isAuth,
    param("city").isString(), 
    isValidCity,
    showErrors, 
    UserFavourites.deleteCity
);

export default router;