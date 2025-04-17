'use client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Image from "next/image";
import React, { useState, useEffect } from 'react';
import { WeatherData, ApiError } from "@/types";

export default function Home() {
  const [city, setCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchWeatherData = async (lat?: number, lon?: number) => {
    setError(null);
    setLocationError(null);
    setIsLoading(true);
    try {
      const url = lat && lon
        ? `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=imperial`
        : `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=imperial`;

      const response = await fetch(url);
      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message);
      }
      const data: WeatherData = await response.json();
      setWeatherData(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (error) => {
          setLocationError('Failed to get your location');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      fetchWeatherData();
    }
  };

  return (
    <div 
    style={{'--bg-url': `url('/weather_backgrounds/${weatherData?.weather[0].icon}.jpg')`} as React.CSSProperties} 
    className={`bg-[image:var(--bg-url)] bg-cover bg-no-repeat bg-center grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20`}
    >
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex flex-row gap-4 items-center bg-black/30 backdrop-blur-sm p-4 rounded-lg shadow-md">
          <h1 className="text-5xl text-white font-[700]">PENN-E Weather App</h1>
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-white p-2 border border-gray-300 rounded bg-transparent"
          />
          <button
            onClick={() => fetchWeatherData()}
            className="p-2 bg-transparent text-white rounded"
          >
            Get Weather
          </button>
        </div>
        
        {isLoading && <p>Loading Weather Data...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {locationError && <p className="text-red-500">{locationError}</p>}
        {weatherData && (
          <div className="flex-col gap-4 w-full">
            <div className="flex gap-4 bg-black/30 backdrop-blur-sm p-10 w-full rounded-lg shadow-md text-white mb-6">
              <div className="flex flex-col gap-4 items-start w-full">
                <h2 className="text-4xl font-[600]"> {weatherData.name}</h2>
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-end gap-4 items-center">
                    <p className="text-8xl font-[700] text-orange-300">{Math.round(weatherData.main.temp)}°</p>
                    <p className="text-2xl font-[500] capitalize">{weatherData.weather[0].description}</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-col bg-black/50 p-6 rounded-md">
                      <p className="text-gray-500 mb-3">High</p>
                      <p className="text-2xl font-[500] text-white">{Math.round(weatherData.main.temp_max)}°</p>
                    </div>
                    <div className="flex-col bg-black/50 p-6 rounded-md">
                      <p className="text-gray-500 mb-3">Low</p>
                      <p className="text-2xl font-[500] text-white">{Math.round(weatherData.main.temp_min)}°</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 bg-black/30 backdrop-blur-sm p-10 w-full rounded-lg shadow-md text-white">
              <div className="flex flex-col gap-4 items-start w-full">
                <h2 className="text-3xl font-[600]">Details</h2>
                <div className="flex gap-2 w-full">
                  <div className="flex flex-col grow items-center bg-black/50 p-6 rounded-md">
                    <p className="text-gray-500 text-center mb-3">Visibility</p>
                    <p className="text-2xl font-[500] text-center text-white"> {Math.round(weatherData.visibility / 1000)} km</p>
                  </div>
                  <div className="flex flex-col grow items-center bg-black/50 p-6 rounded-md">
                    <p className="text-gray-500 text-center mb-3">Humidity</p>
                    <p className="text-2xl font-[500] text-center text-white"> {weatherData.main.humidity}%</p>
                  </div>
                  <div className="flex flex-col grow items-center bg-black/50 p-6 rounded-md">
                    <p className="text-gray-500 text-center mb-3">Pressure</p>
                    <p className="text-2xl font-[500] text-center text-white">{Math.round(weatherData.main.pressure)} hPa</p>
                  </div>
                  <div className="flex flex-col grow items-center bg-black/50 p-6 rounded-md">
                    <p className="text-gray-500 text-center mb-3">Feels Like</p>
                    <p className="text-2xl font-[500] text-center text-white">{Math.round(weatherData.main.feels_like)}°</p>
                  </div>
                  <div className="flex flex-col grow items-center bg-black/50 p-6 rounded-md">
                    <p className="text-gray-500 text-center mb-3">Wind Speed</p>
                    <p className="text-2xl font-[500] text-center text-white">{Math.round(weatherData.wind.speed)} mph</p>
                  </div>
                </div>              
              </div>
            </div>
          </div>
        )}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          href="https://donaldlivingston.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        > A Donald Livingston Project</a>
      </footer>
    </div>
  );
}
