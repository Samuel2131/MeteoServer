
import jwt from "jsonwebtoken";

export const apyKeyWeather = "49a7c8380f7a6ecff79d641e50ea7f48";
export const urlWeatherMap =  "https://api.openweathermap.org/data/2.5/weather";
export const urlAirPollutionApi = "http://api.openweathermap.org/data/2.5/air_pollution";
export const urlGeocodingApi = "http://api.openweathermap.org/geo/1.0/direct";
export const urlForecastWeather = "https://api.openweathermap.org/data/2.5/forecast";
export const accesTokenLifetime = 60 * 60 * 1000;
export const refreshTokenLifetime = 120 * 60 * 1000;
export const checkDatabaseTime = 30 * 60 * 1000;
export const longPassword = "LongPassword1LongPassword1LongPassword1LongPassword1LongPassword1";
export const regexPasswordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,32}$/;
export const saltRounds = 10;
export const sshKey = "b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAlwAAAAdzc2gtcnNhAAAAAwEAAQAAAIEA2UEBh9CoKjibnhIsg5Zygdmu75WMQISwKC9ectjRR1gNzsc/OZqqvd15RHaK06at3cEBqyl4FyeSlitlOQYZjasfbuKqXZ0gQqUZyO5zANX/QMg9RJmQaZotfvbqG9HM91rPszNxphD3i+hbf/M0PNJUx8D3s0nU7F5DAUrRbEkAAAIQQLDHvECwx7wAAAAHc3NoLXJzYQAAAIEA2UEBh9CoKjibnhIsg5Zygdmu75WMQISwKC9ectjRR1gNzsc/OZqqvd15RHaK06at3cEBqyl4FyeSlitlOQYZjasfbuKqXZ0gQqUZyO5zANX/QMg9RJmQaZotfvbqG9HM91rPszNxphD3i+hbf/M0PNJUx8D3s0nU7F5DAUrRbEkAAAADAQABAAAAgQCYLXK3Aa9ps7E9rhlEKxQWZLam16ggYVFLNLMB22HsiX9SgjqFTROgXwxcqnRgAPb0yAc1L50RCwUg71C9+snWKaFXLz15QAFYLFiUjkeE3E8tDFU1h15QH314bPqqeqjOq2wTcuoRLGAMEpWEZASdRzQ6cNp/0W2+DivBmtcUAQAAAEEA3wOPx3eHHz3Vo/R3OvvROS8vcQnrqhgO4IMCQBryuQFZ8suJkYUC61Jv2LL43XDZkfoByRY23MXQmQsQBheQ4wAAAEEA86otqU7sda+AhNZ41iBSH7WKCmMuyUt6aVrsN7Rceq6ng38YRrYplBpSbBhWgXByUN/Y7FU8HFqWeZwjbCfHQQAAAEEA5ECNHlclMT2nOeZmxqALyWSp4npHnuI4T/bxwjzPeLz7PhlNeKFGlO0PRFTKKjvK4ssxp5qTkvxftV/VQZOrCQAAABR1c2VyQExBUFRPUC00Q04wN1NBUwECAwQF";

export const convertToken = (jwtToken: string | string[]) => {
    let JwtPayload;
    jwt.verify(jwtToken as string, sshKey, (err, decoded) => {
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

export const getDay = (date1: Date, date2: Date) => Math.ceil(Math.abs(new Date(date1).getTime()-new Date(date2).getTime()) / (1000 * 60 * 60 * 24));
export const getAccessToken = (user: any) => jwt.sign({id: user.id, email: user.email, username: user.username, age: user.age, gender: user.gender, cityFavourites: user.cityFavourites}, sshKey, {expiresIn: accesTokenLifetime});
export const getRefreshToken = (user: any) => jwt.sign({id: user.id, email: user.email, username: user.username, age: user.age, gender: user.gender, cityFavourites: user.cityFavourites}, sshKey, {expiresIn: refreshTokenLifetime});