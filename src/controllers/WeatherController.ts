
import { Request, Response } from "express";
import { getAirQuality, getCurrentWeather, getForecastWeather } from "../utils/utilsWeather";

export default class Weather {
    public static readonly AirQuality = async ({params}: Request, res: Response) => {
        const airQuality = await getAirQuality(params.city);
        if(!airQuality) return res.status(404).json({message: "city not found"});
        const {data, status} = airQuality;
        if(status === 200) {
            const currentWeatherData = await getCurrentWeather(params.city);
            if(!currentWeatherData) return res.status(404).json({message: "city not found"});
            const {data: currentWeather, status: statusCurrentWeather} = currentWeatherData;
            if(statusCurrentWeather === 200) {
                data.list[0].wind = currentWeather.wind;
                return res.status(status).json(data);
            }
            else res.status(statusCurrentWeather).json({message: "Bad request..."});
        }
        else res.status(status).json({message: "Bad request..."});
    };

    public static readonly CurrentWeather = async ({params}: Request, res: Response) => {
        try{
            const currentWeather = await getCurrentWeather(params.city);
            if(!currentWeather) return res.status(404).json({message: "city not found"});
            const {data, status} = currentWeather;
            res.status(status).json(data);
        }catch(e: any){ 
            res.status(e.response.status).json({message: e.response.statusText});
        }
    };

    public static readonly ForecastWeather = async ({params, query}: Request, res: Response) => {
        try{
            const forecastWeather = await getForecastWeather(params.city);
            if(!forecastWeather) return res.status(404).json({message: "city not found"});
            const {data, status} = forecastWeather;
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