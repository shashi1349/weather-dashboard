import { useEffect, useRef, useState } from "react";
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

import { generateCustomAlerts } from "../utils/EmojiHelpers";
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
  const precipitationChartRef = useRef(null);
  const [showFavoritesMenu, setShowFavoritesMenu] = useState(false);

  useEffect(() => {
    setFavorites(getFavorites());
    fetchCityWeather("Hyderabad");
  }, []);

  // 🔥 FIXED FUNCTION
  const fetchCityWeather = async (city) => {
    // ✅ Handle location properly
    if (city === "Your Location") {
      setError("");
      handleUseCurrentLocation();
      return;
    }

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
        return;
      }

      const coords = await getCoordinates(city);

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

      const payload = {
        cityInfo: cityInfoObj,
        weatherData: weather,
        customAlerts: alerts,
      };

      setCache(weatherCityKey, payload, CACHE_TTL.WEATHER);
      setCache(aqiCityKey, aqi, CACHE_TTL.AQI);
    } catch (err) {
      const stale = getStaleCache(weatherCityKey);

      if (stale) {
        setCityInfo(stale.cityInfo);
        setWeatherData(stale.weatherData);
        setCustomAlerts(stale.customAlerts);
        setError("Showing cached data due to API issue.");
      } else {
        setError(err.message || "City not found");
        setWeatherData(null);
        setCityInfo(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = (city) => {
    if (!city || city === "Your Location") return;
    addFavorite(city);
    setFavorites(getFavorites());
  };

  const handleRemoveFavorite = (city) => {
    removeFavorite(city);
    setFavorites(getFavorites());
  };

  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        setLoading(true);
        setError("");

        const [weather, aqi] = await Promise.all([
          getWeatherBundle(latitude, longitude, "auto"),
          getAQIData(latitude, longitude, "auto"),
        ]);

        const cityInfoObj = {
          name: "Your Location",
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
      } catch {
        setError("Unable to fetch your location weather");
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div className="dashboard-page">
      {/* 🔥 TOPBAR */}
      <div className="dashboard-topbar">
        <SearchBar onSearch={fetchCityWeather} />

        <div className="dashboard-top-actions">
          <LocationButton onUseLocation={handleUseCurrentLocation} />

          <button
            className="favorites-toggle-btn"
            onClick={() => setShowFavoritesMenu((prev) => !prev)}
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
                <p>No favorites yet</p>
              ) : (
                favorites.map((city, index) => (
                  <div key={index} className="favorite-dropdown-item">
                    <button
                      onClick={() => {
                        if (city === "Your Location") {
                          handleUseCurrentLocation();
                        } else {
                          fetchCityWeather(city);
                        }
                        setShowFavoritesMenu(false);
                      }}
                    >
                      {city}
                    </button>

                    <button onClick={() => handleRemoveFavorite(city)}>
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* 🔥 TITLE */}
      <div className="dashboard-title-row">
        <div>
          <h1>Today, {dayjs().format("dddd")}</h1>
          <p>{dayjs().format("DD MMM YYYY • hh:mm A")}</p>
          <span className="last-updated-badge">
            Last Updated: {lastUpdated}
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
              weatherData={weatherData}
            />

            <ForecastCardsSection
              weatherData={weatherData}
              onScrollToHourly={() =>
                hourlyChartRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              onScrollToPrecipitation={() =>
                precipitationChartRef.current?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            />
          </div>

          {/* 🔥 STATS */}
          <div className="dashboard-row-two">
            <div className="mini-stats-grid">
              <MiniStatCard
                title="Humidity"
                value={`${weatherData.current.relative_humidity_2m}%`}
                icon="💧"
              />
              <MiniStatCard
                title="Wind"
                value={`${weatherData.current.wind_speed_10m} km/h`}
                icon="💨"
              />
            </div>

            <div className="side-info-grid">
              <AQICard aqi={aqiData?.current?.us_aqi} />
              <AlertBanner alerts={customAlerts} />
            </div>
          </div>

          {/* 🔥 CHARTS */}
          <div className="dashboard-bottom-section">
            <div ref={hourlyChartRef}>
              <HourlyTempChart weatherData={weatherData} />
            </div>

            <div ref={precipitationChartRef}>
              <PrecipitationChart weatherData={weatherData} />
            </div>

            <SevenDayTrendChart weatherData={weatherData} />

            <HistoricalComparisonCard
              currentTemp={weatherData.current.temperature_2m}
              lat={cityInfo.lat}
              lon={cityInfo.lon}
              timezone={cityInfo.timezone}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;