
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { isIn } from "../db/dbUsers";
import jwt, { JwtPayload }  from "jsonwebtoken";
import { User } from "../models/mongooseSchema";

export const apyKeyWeather = "49a7c8380f7a6ecff79d641e50ea7f48";
export const urlWeatherMap =  "https://api.openweathermap.org/data/2.5/weather";
export const urlAirPollutionApi = "http://api.openweathermap.org/data/2.5/air_pollution";
export const urlGeocodingApi = "http://api.openweathermap.org/geo/1.0/direct";
export const urlForecastWeather = "https://api.openweathermap.org/data/2.5/forecast";
export const tokenLifetime = 60 * 60;
export const refreshTokenLifetime = 120 * 60;
export const longPassword = "LongPassword1LongPassword1LongPassword1LongPassword1LongPassword1";
export const regexPasswordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,32}$/;
export const saltRounds = 10;
export const sshKey = "b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAlwAAAAdzc2gtcnNhAAAAAwEAAQAAAIEA2UEBh9CoKjibnhIsg5Zygdmu75WMQISwKC9ectjRR1gNzsc/OZqqvd15RHaK06at3cEBqyl4FyeSlitlOQYZjasfbuKqXZ0gQqUZyO5zANX/QMg9RJmQaZotfvbqG9HM91rPszNxphD3i+hbf/M0PNJUx8D3s0nU7F5DAUrRbEkAAAIQQLDHvECwx7wAAAAHc3NoLXJzYQAAAIEA2UEBh9CoKjibnhIsg5Zygdmu75WMQISwKC9ectjRR1gNzsc/OZqqvd15RHaK06at3cEBqyl4FyeSlitlOQYZjasfbuKqXZ0gQqUZyO5zANX/QMg9RJmQaZotfvbqG9HM91rPszNxphD3i+hbf/M0PNJUx8D3s0nU7F5DAUrRbEkAAAADAQABAAAAgQCYLXK3Aa9ps7E9rhlEKxQWZLam16ggYVFLNLMB22HsiX9SgjqFTROgXwxcqnRgAPb0yAc1L50RCwUg71C9+snWKaFXLz15QAFYLFiUjkeE3E8tDFU1h15QH314bPqqeqjOq2wTcuoRLGAMEpWEZASdRzQ6cNp/0W2+DivBmtcUAQAAAEEA3wOPx3eHHz3Vo/R3OvvROS8vcQnrqhgO4IMCQBryuQFZ8suJkYUC61Jv2LL43XDZkfoByRY23MXQmQsQBheQ4wAAAEEA86otqU7sda+AhNZ41iBSH7WKCmMuyUt6aVrsN7Rceq6ng38YRrYplBpSbBhWgXByUN/Y7FU8HFqWeZwjbCfHQQAAAEEA5ECNHlclMT2nOeZmxqALyWSp4npHnuI4T/bxwjzPeLz7PhlNeKFGlO0PRFTKKjvK4ssxp5qTkvxftV/VQZOrCQAAABR1c2VyQExBUFRPUC00Q04wN1NBUwECAwQF";

export const showErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array();
    if(errors.length !== 0 && errors[0].location === "headers" && errors[0].param === "authorization") return res.status(401).json({errors});
    validationResult(req).isEmpty() ? next() : res.status(400).json({errors});
};

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    try{
        const user = (jwt.verify(req.headers.authorization as string, sshKey)) as JwtPayload;
        res.locals.user = user;
        if(!isIn(user.email)) return res.status(401).json({message: "not autorizhed"});
        else next();
    } catch (e: any){
        if(req.headers.refreshtoken){
            try{
                const user = (jwt.verify(req.headers.refreshtoken as string, sshKey)) as JwtPayload;
                res.locals.user = user;
                if(!isIn(user.email)) return res.status(401).json({message: "not autorizhed"});
                else next();
            } catch(e: any) {
                return res.status(401).json({message: e.message});
            }
        }
        else res.status(401).json({message: e.message});
    }
};

export const convertToken = (jwtToken: string) => {
    let JwtPayload;
    jwt.verify(jwtToken as string, sshKey, (err, decoded) => {
        if(err) throw new Error(err.name);
        JwtPayload = decoded;
    });
    return JwtPayload;
};

export const getUserFromDocument = (user: any) => {
    return {
        id: user.id,
        email: user.email,
        username: user.username,
        password: user.password,
        cityFavourites: user.cityFavourites,
        verify: user.verify || null,
        token: user.token || null,
        refreshToken: user.refreshToken || null,
    };
};

export const getUserFromSignup = (user: User) => {
    return {
        id: user.id,
        email: user.email,
        username: user.username,
        cityFavourites: user.cityFavourites,
        verify: user.verify
    };
};

export const getUserFromValidate = (user: User) => {
    return {
        id: user.id,
        email: user.email,
        username: user.username,
        cityFavourites: user.cityFavourites,
        password: user.password
    };
};

export const getToken = (user: User) => jwt.sign({id: user.id, email: user.email, username: user.username, cityFavourites: user.cityFavourites}, sshKey, {expiresIn: tokenLifetime});
export const getRefreshToken = (user: User) => jwt.sign({id: user.id, email: user.email, username: user.username, cityFavourites: user.cityFavourites}, sshKey, {expiresIn: refreshTokenLifetime});