
interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

interface Main {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
}

interface Clouds {
    all: number;
}

interface Wind {
    speed: number;
    deg: number;
    gust: number;
}

interface Rain {
    "3h": number;
}

interface Sys {
    pod: string;
}

interface ForecastItem {
    dt: number;
    main: Main;
    weather: Weather[];
    clouds: Clouds;
    wind: Wind;
    visibility: number;
    pop: number;
    rain: Rain;
    sys: Sys;
    dt_txt: string;
}

export type WeatherForecast = {
    cod: string;
    message: number;
    cnt: number;
    list: ForecastItem[];
}