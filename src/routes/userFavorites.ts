
import express from "express";
import { header, param } from "express-validator";
import { showErrors } from "../utils/utils";
import UserFavourites from "../controllers/UserFavouritesController";

const router = express.Router();

router.post("/:city", 
    header("authorization").isJWT(), 
    showErrors, 
    UserFavourites.addCity
);

router.get("/", 
    header("authorization").isJWT(), 
    showErrors, 
    UserFavourites.getCity
);

router.delete("/:city", 
    header("authorization").isJWT(), 
    param("city").isString(), 
    showErrors, 
    UserFavourites.deleteCity
);

export default router;