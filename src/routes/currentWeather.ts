
import axios from "axios";
import express from "express";
import { param } from "express-validator";
import { showErrors, urlWeatherMap, apyKeyWeather } from "../utils/utils";
import { WeatherData } from "../models/weatherType";

const router = express.Router();

router.get("/:city", param("city").isString().not().isEmpty(), showErrors, async ({params}, res) => {
    try{
        const { data, status } = await axios.get<WeatherData>(`${urlWeatherMap}?q=${params.city}&appid=${apyKeyWeather}`);
        if(status === 200) return res.status(status).json(data);
        else res.status(status).json({message: "Bad request..."});
    }catch(e: any){ 
        res.status(e.response.status).json({message: e.response.statusText});
    }
});

export default router;