export interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    temp_max: number;
    temp_min: number;
    feels_like: number;
    pressure: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

export interface ApiError {
  message: string;
}