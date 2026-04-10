import {useEffect, useRef, useState} from "react";
import dayjs from "dayjs";

import "./Dashboard.css";

import SearchBar from "../components/search/SearchBar";
import CurrentWeatherCard from "../components/current/CurrentWeatherCard";
import ForecastCardsSection from "../components/forecast/ForecastCardsSection";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import MiniStatCard from "../components/current/MiniStatCard";
import AQICard from "../components/analytics/AQICard";
import AlertBanner from "../components/alerts/AlertBanner";
import HourlyTempChart from "../components/charts/HourlyTempChart";
import PrecipitationChart from "../components/charts/PrecipitationChart";
import SevenDayTrendChart from "../components/charts/SevenDayTrendChart";
import HistoricalComparisonCard from "../components/analytics/HistoricalComparisonCard";

import LocationButton from "../components/location/LocationButton";


import {
  getCoordinates,
  getWeatherBundle,
  getAQIData,
} from "../services/weatherApi";

import {generateCustomAlerts} from "../utils/EmojiHelpers";
import {
  CACHE_TTL,
  getCache,
  setCache,
  getStaleCache,
  buildCityCacheKey,
  buildCoordsCacheKey,
} from "../services/cacheService";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../services/favoritesService";

function Dashboard() {
  const [cityInfo, setCityInfo] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [customAlerts, setCustomAlerts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
    const hourlyChartRef = useRef(null);
    const [showFavoritesMenu, setShowFavoritesMenu] = useState(false);
const precipitationChartRef = useRef(null);
  useEffect(() => {
    setFavorites(getFavorites());
    fetchCityWeather("Hyderabad");
  }, []);

  const fetchCityWeather = async city => {
    const weatherCityKey = buildCityCacheKey("weather", city);
    const aqiCityKey = buildCityCacheKey("aqi", city);

    try {
        setLoading(true);
        setError("");

        const cachedWeather = getCache(weatherCityKey);
        const cachedAqi = getCache(aqiCityKey);

        if (cachedWeather && cachedAqi) {
        setCityInfo(cachedWeather.cityInfo);
        setWeatherData(cachedWeather.weatherData);
        setAqiData(cachedAqi);
        setCustomAlerts(cachedWeather.customAlerts);
        setLastUpdated(dayjs().format("DD MMM YYYY • hh:mm A"));
        setLoading(false);
        return;
        }

        const coords = await getCoordinates(city);

        const weatherCoordsKey = buildCoordsCacheKey("weather", coords.lat, coords.lon);
        const aqiCoordsKey = buildCoordsCacheKey("aqi", coords.lat, coords.lon);

        const cachedWeatherByCoords = getCache(weatherCoordsKey);
        const cachedAqiByCoords = getCache(aqiCoordsKey);

        if (cachedWeatherByCoords && cachedAqiByCoords) {
        setCityInfo(cachedWeatherByCoords.cityInfo);
        setWeatherData(cachedWeatherByCoords.weatherData);
        setAqiData(cachedAqiByCoords);
        setCustomAlerts(cachedWeatherByCoords.customAlerts);
        setLastUpdated(dayjs().format("DD MMM YYYY • hh:mm A"));
        setLoading(false);
        return;
        }

        const [weather, aqi] = await Promise.all([
        getWeatherBundle(coords.lat, coords.lon, coords.timezone),
        getAQIData(coords.lat, coords.lon, coords.timezone),
        ]);

        const cityInfoObj = {
        name: coords.name,
        country: coords.country,
        lat: coords.lat,
        lon: coords.lon,
        timezone: coords.timezone,
        };

        const alerts = generateCustomAlerts(weather, aqi);

        setCityInfo(cityInfoObj);
        setWeatherData(weather);
        setAqiData(aqi);
        setCustomAlerts(alerts);
        setLastUpdated(dayjs().format("DD MMM YYYY • hh:mm A"));

        const weatherPayload = {
        cityInfo: cityInfoObj,
        weatherData: weather,
        customAlerts: alerts,
        };

        setCache(weatherCityKey, weatherPayload, CACHE_TTL.WEATHER);
        setCache(weatherCoordsKey, weatherPayload, CACHE_TTL.WEATHER);
        setCache(aqiCityKey, aqi, CACHE_TTL.AQI);
        setCache(aqiCoordsKey, aqi, CACHE_TTL.AQI);
    } catch (err) {
        const staleWeather =
        getStaleCache(weatherCityKey) || getStaleCache(buildCityCacheKey("weather", city));
        const staleAqi =
        getStaleCache(aqiCityKey) || getStaleCache(buildCityCacheKey("aqi", city));

        if (staleWeather) {
        setCityInfo(staleWeather.cityInfo);
        setWeatherData(staleWeather.weatherData);
        setAqiData(staleAqi || null);
        setCustomAlerts(staleWeather.customAlerts || []);
        setLastUpdated(dayjs().format("DD MMM YYYY • hh:mm A"));
        setError("Showing cached data due to API/network issue.");
        } else {
        setError(err.message || "Something went wrong while fetching weather data");
        setWeatherData(null);
        setAqiData(null);
        setCityInfo(null);
        setCustomAlerts([]);
        }
    } finally {
        setLoading(false);
    }
    };

  const handleAddFavorite = city => {
    if (!city) return;
    addFavorite(city);
    setFavorites(getFavorites());
  };

  const handleRemoveFavorite = city => {
    removeFavorite(city);
    setFavorites(getFavorites());
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
        setError("Geolocation is not supported in this browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async position => {
        const {latitude, longitude} = position.coords;

        const weatherCoordsKey = buildCoordsCacheKey("weather", latitude, longitude);
        const aqiCoordsKey = buildCoordsCacheKey("aqi", latitude, longitude);

        try {
            setLoading(true);
            setError("");

            const cachedWeather = getCache(weatherCoordsKey);
            const cachedAqi = getCache(aqiCoordsKey);

            if (cachedWeather && cachedAqi) {
            setCityInfo(cachedWeather.cityInfo);
            setWeatherData(cachedWeather.weatherData);
            setAqiData(cachedAqi);
            setCustomAlerts(cachedWeather.customAlerts);
            setLastUpdated(dayjs().format("DD MMM YYYY • hh:mm A"));
            setLoading(false);
            return;
            }

            const [weather, aqi] = await Promise.all([
            getWeatherBundle(latitude, longitude, "auto"),
            getAQIData(latitude, longitude, "auto"),
            ]);

            const cityInfoObj = {
            name: "Your Location",
            country: "",
            lat: latitude,
            lon: longitude,
            timezone: weather.timezone,
            };

            const alerts = generateCustomAlerts(weather, aqi);

            setCityInfo(cityInfoObj);
            setWeatherData(weather);
            setAqiData(aqi);
            setCustomAlerts(alerts);
            setLastUpdated(dayjs().format("DD MMM YYYY • hh:mm A"));

            const weatherPayload = {
            cityInfo: cityInfoObj,
            weatherData: weather,
            customAlerts: alerts,
            };

            setCache(weatherCoordsKey, weatherPayload, CACHE_TTL.WEATHER);
            setCache(aqiCoordsKey, aqi, CACHE_TTL.AQI);
        } catch (err) {
            const staleWeather = getStaleCache(weatherCoordsKey);
            const staleAqi = getStaleCache(aqiCoordsKey);

            if (staleWeather) {
            setCityInfo(staleWeather.cityInfo);
            setWeatherData(staleWeather.weatherData);
            setAqiData(staleAqi || null);
            setCustomAlerts(staleWeather.customAlerts || []);
            setLastUpdated(dayjs().format("DD MMM YYYY • hh:mm A"));
            setError("Showing cached location data due to API/network issue.");
            } else {
            setError("Unable to fetch weather for your location.");
            }
        } finally {
            setLoading(false);
        }
        },
        () => {
        setError("Location permission denied.");
        }
    );
    };

  return (
    <div className="dashboard-page">
      <div className="dashboard-topbar">
        <SearchBar onSearch={fetchCityWeather} />

        <div className="dashboard-top-actions">
            <LocationButton onUseLocation={handleUseCurrentLocation} />

            <button
                className="favorites-toggle-btn"
                onClick={() => setShowFavoritesMenu(prev => !prev)}
            >
                ⭐ Favorites
            </button>

            <button
                className="add-favorite-btn"
                onClick={() => handleAddFavorite(cityInfo?.name)}
            >
                + Add to Favorites
            </button>



            {showFavoritesMenu && (
                <div className="favorites-dropdown-menu">
                <h4>Your Favorites</h4>

                {favorites.length === 0 ? (
                    <p className="favorites-empty-text">No favorite cities added yet.</p>
                ) : (
                    favorites.map((city, index) => (
                    <div key={index} className="favorite-dropdown-item">
                        <button
                        className="favorite-city-btn"
                        onClick={() => {
                            fetchCityWeather(city);
                            setShowFavoritesMenu(false);
                        }}
                        >
                        {city}
                        </button>

                        <button
                        className="remove-favorite-btn"
                        onClick={() => handleRemoveFavorite(city)}
                        >
                        ✕
                        </button>
                    </div>
                    ))
                )}
                </div>
            )}
            </div>
      </div>

      <div className="dashboard-title-row">
        <div>
          <h1>Today, {dayjs().format("dddd")}</h1>
          <p>{dayjs().format("DD MMM YYYY • hh:mm A")}</p>
          <span className="last-updated-badge">
            Last Updated: {lastUpdated || dayjs().format("hh:mm A")}
          </span>
        </div>


      </div>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      {!loading && weatherData && cityInfo && (
        <>
          <div className="dashboard-hero-grid">
            <CurrentWeatherCard
              cityName={cityInfo.name}
              country={cityInfo.country}
              weatherData={weatherData}
            />

            <ForecastCardsSection
                weatherData={weatherData}
                onScrollToHourly={() =>
                    hourlyChartRef.current?.scrollIntoView({behavior: "smooth", block: "start"})
                }
                onScrollToPrecipitation={() =>
                    precipitationChartRef.current?.scrollIntoView({behavior: "smooth", block: "start"})
                }
                />
          </div>

          <div className="dashboard-note">
            <p>
              Weather data loaded for <strong>{cityInfo.name}{cityInfo.country ? `, ${cityInfo.country}` : ""}</strong>
            </p>
          </div>

          

          <div className="dashboard-row-two">
            <div className="mini-stats-grid">
              <MiniStatCard
                title="Sunrise"
                value={dayjs(weatherData.daily.sunrise[0]).format("hh:mm A")}
                subtitle="Sunrise time"
                icon="🌅"
              />

              <MiniStatCard
                title="Sunset"
                value={dayjs(weatherData.daily.sunset[0]).format("hh:mm A")}
                subtitle="Sunset time"
                icon="🌇"
              />

              <MiniStatCard
                title="Feels Like"
                value={`${Math.round(weatherData.current.apparent_temperature)}°`}
                subtitle="Apparent temperature"
                icon="🌡️"
              />

              <MiniStatCard
                title="Wind Status"
                value={`${weatherData.current.wind_speed_10m} km/h`}
                subtitle="Current wind"
                icon="💨"
              />

              <MiniStatCard
                title="Visibility"
                value={`${(weatherData.hourly.visibility[0] / 1000).toFixed(1)} km`}
                subtitle="Visibility range"
                icon="👁️"
              />

              <MiniStatCard
                title="Humidity"
                value={`${weatherData.current.relative_humidity_2m}%`}
                subtitle="Humidity level"
                icon="💧"
              />
            </div>

            <div className="side-info-grid">
              <AQICard aqi={aqiData?.current?.us_aqi} />
              <AlertBanner alerts={customAlerts} />
            </div>
          </div>

          <div className="dashboard-bottom-section">
            <div className="dashboard-full-chart-row" ref={hourlyChartRef}>
                <HourlyTempChart weatherData={weatherData} />
            </div>

            <div className="dashboard-full-chart-row" ref={precipitationChartRef}>
                <PrecipitationChart weatherData={weatherData} />
            </div>

            <div className="dashboard-full-chart-row">
                <SevenDayTrendChart weatherData={weatherData} />
            </div>

            <div className="dashboard-history-row">
                <HistoricalComparisonCard
                currentTemp={weatherData.current.temperature_2m}
                lat={cityInfo.lat}
                lon={cityInfo.lon}
                timezone={cityInfo.timezone}
                />
            </div>
            </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;