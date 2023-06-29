
import axios from "axios";
import { apyKeyWeather, urlAirPollutionApi, urlForecastWeather, urlGeocodingApi, urlWeatherMap } from "./utils";
import { WeatherPollutionType } from "../models/weatherPollutionType";
import { WeatherData } from "../models/weatherType";
import { WeatherForecast } from "../models/weatherForecastType";

const getGeocodingData = async (city: string) => {
    try{
        const { data: geocoding } = await axios.get(`${urlGeocodingApi}?q=${city}&limit=1&appid=${apyKeyWeather}`);
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

        const { data, status } = await axios.get<WeatherPollutionType>(`${urlAirPollutionApi}?lat=${geocoding[0].lat}&lon=${geocoding[0].lon}&appid=${apyKeyWeather}`);
        return {data, status};
    } catch(e){
        return null;
    }
};

export const getCurrentWeather = async (city: string) => {
    try{
        const {data, status} = await axios.get<WeatherData>(`${urlWeatherMap}?q=${city}&appid=${apyKeyWeather}`);
        return {data, status};
    } catch(e) {
        return null;
    }
};

export const getForecastWeather = async (city: string) => {
    try{
        const { data, status } = await axios.get<WeatherForecast>(`${urlForecastWeather}?q=${city}&appid=${apyKeyWeather}`);
        return {data, status};
    } catch(e) {
        return null;
    }
};