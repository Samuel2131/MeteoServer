
import jwt from "jsonwebtoken";

export const accesTokenLifetime = 60 * 60 * 1000;
export const refreshTokenLifetime = 120 * 60 * 1000;
export const checkDatabaseTime = 60 * 60 * 1000;
export const longPassword = "LongPassword1LongPassword1LongPassword1LongPassword1LongPassword1";
export const regexPasswordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,32}$/;
export const saltRounds = 10;

export const convertToken = (jwtToken: string | string[]) => {
    let JwtPayload;
    jwt.verify(jwtToken as string, process.env.SSHKEY!, (err, decoded) => {
        if(err) JwtPayload = err;
        else JwtPayload = decoded;
    });
    return JwtPayload;
};

export const getUserFromSignup = (user: any) => {
    return {
        id: user._id,
        email: user.email,
        username: user.username,
        age: user.age,
        gender: user.gender,
        cityFavourites: user.cityFavourites,
        verify: user.verify
    };
};

export const getUserFromValidate = (user: any) => {
    return {
        id: user._id,
        email: user.email,
        username: user.username,
        age: user.age,
        gender: user.gender,
        cityFavourites: user.cityFavourites,
        password: user.password
    };
};

export const getHours = (date1: Date, date2: Date) => Math.ceil(Math.abs(new Date(date1).getTime()-new Date(date2).getTime()) / (1000 * 60 * 60));
export const getAccessToken = (user: any) => jwt.sign({id: user.id, email: user.email, username: user.username, age: user.age, gender: user.gender, cityFavourites: user.cityFavourites}, process.env.SSHKEY!, {expiresIn: accesTokenLifetime});
export const getRefreshToken = (user: any) => jwt.sign({id: user.id, email: user.email, username: user.username, age: user.age, gender: user.gender, cityFavourites: user.cityFavourites}, process.env.SSHKEY!, {expiresIn: refreshTokenLifetime});