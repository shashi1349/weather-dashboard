import {fetchWithRetry} from "./apiClient";

const GEO_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_BASE_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_BASE_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

export const getCoordinates = async city => {
  const url = `${GEO_BASE_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

  const data = await fetchWithRetry(url);

  if (!data?.results || data.results.length === 0) {
    throw new Error("City not found");
  }

  const location = data.results[0];

  return {
    name: location.name,
    country: location.country,
    lat: location.latitude,
    lon: location.longitude,
    timezone: location.timezone || "auto",
  };
};

export const getWeatherBundle = async (lat, lon, timezone = "auto") => {
const url = `${WEATHER_BASE_URL}?latitude=${lat}&longitude=${lon}&timezone=${timezone}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,visibility,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&forecast_days=14`;  const data = await fetchWithRetry(url);

  return data;
};

export const getAQIData = async (lat, lon, timezone = "auto") => {
  const url = `${AIR_QUALITY_BASE_URL}?latitude=${lat}&longitude=${lon}&timezone=${timezone}&current=us_aqi`;

  const data = await fetchWithRetry(url);

  return data;
};