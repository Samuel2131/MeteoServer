
import axios from "axios";
import express from "express";
import { param, query } from "express-validator";
import { showErrors, urlForecastWeather, apyKeyWeather } from "../utils/utils";
import { WeatherForecast } from "../models/weatherForecastType";

const router = express.Router();

router.get("/:city", param("city").isString().not().isEmpty(), query("limit").optional().isFloat({min: 1, max: 6}), showErrors, async ({params, query}, res) => {
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
});

export default router;