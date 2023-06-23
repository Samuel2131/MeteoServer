
import express from "express";
import { header, param } from "express-validator";
import { showErrors, sshKey } from "../utils/utils";
import { find, pushFavorites, removeFavorites } from "../db/dbUsers";
import jwt, { JwtPayload } from "jsonwebtoken";

const router = express.Router();

router.post("/:city", header("authorization").isJWT(), showErrors, async ({params, headers}, res) => {
    try{
        const user = (await jwt.verify(headers.authorization as string, sshKey)) as JwtPayload;
        const status = await pushFavorites(user.email, params.city);
        if(status === 201) res.status(status).json({message: "City successfully added"});
        else if(status === 409) res.status(status).json({message: "City already present..."});
        else if(status === 500) res.status(status).json({message: "server error"});
    } catch(e){
        res.status(500).json({message: "server error"});
    }
});

router.get("/", header("authorization").isJWT(), showErrors, async ({headers}, res) => {
    try{
        const jwtObj = (await jwt.verify(headers.authorization as string, sshKey)) as JwtPayload;
        const user = await find(jwtObj.email);
        if(user && typeof user !== "number") res.status(200).json(user.cityFavourites);
    } catch(e){
        res.status(500).json({message: "server error"});
    }
});

router.delete("/:city", header("authorization").isJWT(), param("city").isString(), showErrors, async ({params, headers}, res) => {
    try{
        const user = (await jwt.verify(headers.authorization as string, sshKey)) as JwtPayload;
        const status = await removeFavorites(user.email, params.city);
        if(status === 200) res.status(status).json({message: "City successfully deleted"});
        else if(status === 404) res.status(status).json({message: "City not present..."});
        else if(status === 500) res.status(status).json({message: "server error"});
    } catch(e){
        res.status(500).json({message: "server error"});
    }
});

export default router;