
import express from "express";
import { body, header } from "express-validator";
import bycript from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { find, findWithVerify, insertUser, replaceOne, isIn } from "../db/dbUsers";
import jwt from "jsonwebtoken";
import { convertToken, showErrors, sshKey} from "../utils/utils";

const router = express.Router();

export const saltRounds = 10;

router.post("/signup", body("password").notEmpty().isString().isLength({min: 8}).not().isLowercase().not().isUppercase().not().isNumeric().not().isAlpha(), body("username").notEmpty().isString(), body("email").notEmpty().isString().isEmail(),
    showErrors, async ({ body }, res) => {
        body.password = await bycript.hash(body.password, saltRounds);
        body.verify = uuidv4();

        body.cityFavorites = [];

        const user = await insertUser(body);
        if(user === 500) return res.status(500).json({message: "server error..."});
        if(user === 409) return res.status(409).json({message: "Insert err..."});
        if(typeof user !== "number") res.status(201).json({id: user.id, email: user.email, username: user.username ,favorites: user.cityFavourites, verify: user.verify});
    });

router.post("/login", body("email").notEmpty().isString().isEmail(), body("password").notEmpty().isString(), showErrors, async ({body}, res) => {
    const user = await find(body.email);
    if(typeof user === "number") return res.status(500).json({message: "server error..."});
    if(!user || user.verify) res.status(404).json({message: "user not found..."});
    else if(!await bycript.compare(body.password, user.password)) res.status(401).json({message: "wrong password..."});
    else { 
        const userWithoutPassword = {
            id: user.id,
            email: user.email,
            username: user.username,
            cityFavourites: [],
            token: "",
            refreshToken: ""
        };
        userWithoutPassword.token = jwt.sign({id: user.id, email: user.email, username: user.username, cityFavourites: user.cityFavourites}, sshKey, {expiresIn: 60 * 60});
        userWithoutPassword.refreshToken = jwt.sign({id: user.id, email: user.email, username: user.username, cityFavourites: user.cityFavourites}, sshKey, {expiresIn: 120 * 60});
        res.json(userWithoutPassword);
    }
});

router.get("/validate/:token", async ({params}, res) => {
    const user = await findWithVerify(params.token);
    if(typeof user === "number") return res.status(500).json({message: "server error..."});
    if(!user) res.status(404).json({message: "user not found..."});
    else {
        const verify = user.verify;
        if(!await replaceOne(verify as string, {id: user.id, cityFavourites: [], username: user.username, email: user.email, password: user.password})) return res.status(500).json({message: "server error..."});
        res.json({message: "confirmed user"});
    }
});

router.get("/me", header("authorization").isJWT(), showErrors, async ({headers}, res) => {
    try{
        const JwtPayload: any = convertToken(headers.authorization!);
        const user = await find(JwtPayload!.email);
        if(user && typeof user !== "number"){
            if(!isIn(user.email)) return res.status(401).json({message: "not autorizhed"});
            res.json({
                id: user.id,
                username: user.username,
                cityFavorites: user.cityFavourites,
                email: user.email
            });
        }
        else return res.status(500).json({message: "server error..."});
    } catch(err: any) {
        res.status(401).json({message: err.message});
    }
});

router.get("/reauthorization", header("authorization").isJWT(), showErrors, async ({headers}, res) => {
    try{
        const JwtPayload: any = convertToken(headers.authorization!);
        const user = await find(JwtPayload!.email);
        if(user && typeof user !== "number"){
            if(!isIn(user.email)) return res.status(401).json({message: "not autorizhed"});
            res.json({
                token: jwt.sign({id: user.id, email: user.email, username: user.username, cityFavourites: user.cityFavourites}, sshKey, {expiresIn: 60 * 60}),
                refreshToken: jwt.sign({id: user.id, email: user.email, username: user.username, cityFavourites: user.cityFavourites}, sshKey, {expiresIn: 120 * 60})
            });
        }
        else return res.status(500).json({message: "server error..."});
    } catch(e: any) {
        res.status(401).json({message: e.message});
    }
});

export default router;