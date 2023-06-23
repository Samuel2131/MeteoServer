
import { Request, Response } from "express";
import { apyKeyWeather, urlAirPollutionApi, urlForecastWeather, urlGeocodingApi, urlWeatherMap } from "../utils/utils";
import axios from "axios";
import { WeatherPollutionType } from "../models/weatherPollutionType";
import { WeatherData } from "../models/weatherType";
import { WeatherForecast } from "../models/weatherForecastType";

export default class Weather {
    public static readonly AirQuality = async ({params}: Request, res: Response) => {
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
    };

    public static readonly CurrentWeather = async ({params}: Request, res: Response) => {
        try{
            const { data, status } = await axios.get<WeatherData>(`${urlWeatherMap}?q=${params.city}&appid=${apyKeyWeather}`);
            if(status === 200) return res.status(status).json(data);
            else res.status(status).json({message: "Bad request..."});
        }catch(e: any){ 
            res.status(e.response.status).json({message: e.response.statusText});
        }
    };

    public static readonly ForecastWeather = async ({params, query}: Request, res: Response) => {
        try{
            const { data, status } = await axios.get<WeatherForecast>(`${urlForecastWeather}?q=${params.city}&appid=${apyKeyWeather}`);
            if(query.limit){
                let dayArray: Array<0 | 1 | 2 | 3 | 4 | 5 | 6> = [0, 1, 2, 3, 4, 5, 6];
                data.list = data.list.filter(({dt_txt}) => {
                    const day = new Date(dt_txt).getDay();
                    //7 i giorni della settimana meno quanti elementi sono presenti in dayArray, ottengo il numero degli elementi rimossi quindi quanti elementi sto ritornando, se questo valore supera limit non inserisco più;
                    if(dayArray.some((val) => val === day) && (7-dayArray.length) < Number(query.limit)){
                        dayArray = dayArray.filter((val) => val !== day);
                        return true;
                    }
                    else return false;
                });
            }
            if(status === 200) return res.status(status).json(data);
            else res.status(status).json({message: "Bad request..."});
        }catch(e: any){ 
            res.status(e.response.status).json({message: e.response.statusText});
        }
    };
}