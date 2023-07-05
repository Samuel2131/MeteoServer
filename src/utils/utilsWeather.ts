
import axios from "axios";
import { WeatherPollutionType } from "../models/weatherPollutionType";
import { WeatherData } from "../models/weatherType";
import { WeatherForecast } from "../models/weatherForecastType";
import "dotenv/config";

const getGeocodingData = async (city: string) => {
    try{
        const { data: geocoding } = await axios.get(`${process.env.URLGEOCODINGAPI}?q=${city}&limit=1&appid=${process.env.APYKEYWEATHER}`);
        if(geocoding.length === 0) return null;
        return geocoding;
    } catch(e){
        return null;
    }
};

export const getAirQuality = async (city: string) => {
    try{
        const geocoding = await getGeocodingData(city);
        if(!geocoding) return null;

        const { data, status } = await axios.get<WeatherPollutionType>(`${process.env.URLAIRPOLLUTIONAPI}?lat=${geocoding[0].lat}&lon=${geocoding[0].lon}&appid=${process.env.APYKEYWEATHER}`);
        return {data, status};
    } catch(e){
        return null;
    }
};

export const getCurrentWeather = async (city: string) => {
    try{
        const {data, status} = await axios.get<WeatherData>(`${process.env.URLWEATHERMAP}?q=${city}&appid=${process.env.APYKEYWEATHER}`);
        return {data, status};
    } catch(e) {
        return null;
    }
};

export const getForecastWeather = async (city: string) => {
    try{
        const { data, status } = await axios.get<WeatherForecast>(`${process.env.URLFORECASTWEATHER}?q=${city}&appid=${process.env.APYKEYWEATHER}`);
        return {data, status};
    } catch(e) {
        return null;
    }
};