
import axios from "axios";
import express from "express";
import { param } from "express-validator";
import { showErrors, urlAirPollutionApi, apyKeyWeather, urlGeocodingApi, urlWeatherMap } from "../utils/utils";
import { WeatherPollutionType } from "../models/weatherPollutionType";
import { WeatherData } from "../models/weatherType";

const router = express.Router();

router.get("/:city", param("city").isString().not().isEmpty(), showErrors, async ({params}, res) => {
    let geocodingData;
    try{
        const { data: geocoding } = await axios.get(`${urlGeocodingApi}?q=${params.city}&limit=1&appid=${apyKeyWeather}`);
        geocodingData = geocoding;
        if(geocoding.length === 0) return res.status(404).json({message: "City not found..."});
    } catch(e) { /* empty */ }

    try{
        const { data, status } = await axios.get<WeatherPollutionType>(`${urlAirPollutionApi}?lat=${geocodingData[0].lat}&lon=${geocodingData[0].lon}&appid=${apyKeyWeather}`);
        if(status === 200) {
            const { data: currentWeather, status: statusCurrentWeather } = await axios.get<WeatherData>(`${urlWeatherMap}?q=${params.city}&appid=${apyKeyWeather}`);
            if(statusCurrentWeather === 200) {
                data.list[0].wind = currentWeather.wind;
                return res.status(status).json(data);
            }
            else res.status(statusCurrentWeather).json({message: "Bad request..."});
        }
        else res.status(status).json({message: "Bad request..."});
    }catch(e: any){ /* empty */ }
});

export default router;