
import { Request } from "express";
import { getAirQuality, getCurrentWeather, getForecastWeather } from "../utils/utilsWeather";
import { ResponseErrorBadRequest, ResponseErrorInternal, ResponseErrorNotFound, ResponseSuccessJson } from "../utils/responseUtils";

export default class Weather {
    public static readonly AirQuality = async ({params}: Request) => {
        const airQuality = await getAirQuality(params.city);
        if(!airQuality) return ResponseErrorNotFound("city not found");
        const {data, status} = airQuality;
        if(status === 200) {
            const currentWeatherData = await getCurrentWeather(params.city);
            if(!currentWeatherData) return ResponseErrorNotFound("city not found");
            const {data: currentWeather, status: statusCurrentWeather} = currentWeatherData;
            if(statusCurrentWeather === 200) {
                data.list[0].wind = currentWeather.wind;
                return ResponseSuccessJson(data);
            }
            else return ResponseErrorBadRequest(undefined, statusCurrentWeather);
        }
        else return ResponseErrorBadRequest(undefined, status);
    };

    public static readonly CurrentWeather = async ({params}: Request) => {
        try{
            const currentWeather = await getCurrentWeather(params.city);
            if(!currentWeather) return ResponseErrorNotFound("city not found");
            const {data, status} = currentWeather;
            return ResponseSuccessJson(data, status);
        }catch(e: any){ 
            return ResponseErrorInternal(e.response.statusText, e.response.status);
        }
    };

    public static readonly ForecastWeather = async ({params, query}: Request) => {
        try{
            const forecastWeather = await getForecastWeather(params.city);
            if(!forecastWeather) return ResponseErrorNotFound("city not found");
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
            if(status === 200) return ResponseSuccessJson(data, status);
            else return ResponseErrorBadRequest(undefined, status);
        }catch(e: any){ 
            return ResponseErrorInternal(e.response.statusText, e.response.status);
        }
    };
}