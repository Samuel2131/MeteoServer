
export type WeatherPollutionType = {
    coord: {
      lon: number;
      lat: number;
    };
    list: {
      main: {
        aqi: number;
      };
      components: {
        co: number;
        no: number;
        no2: number;
        o3: number;
        so2: number;
        pm2_5: number;
        pm10: number;
        nh3: number;
      };
      dt: number;
      wind: {
        speed: number;
        deg: number;
        gust: number;
      };
    }[];
};