import dayjs from "dayjs";
import {getWeatherLabel, getWeatherEmoji} from "../../utils/EmojiHelpers";
import "./CurrentWeatherCard.css";

function CurrentWeatherCard({cityName, country, weatherData}) {
  if (!weatherData?.current || !weatherData?.daily) return null;

  const current = weatherData.current;
  const daily = weatherData.daily;

  const high = daily.temperature_2m_max?.[0];
  const low = daily.temperature_2m_min?.[0];

  return (
    <div className="current-weather-card-ui">
      <div className="weather-location-pill">
        📍 {cityName}, {country}
      </div>

      <div className="unit-pill">°C</div>

      <div className="current-weather-content">
        <div className="current-weather-main">
          <div style={{fontSize: "2.5rem", marginBottom: "10px"}}>
            {getWeatherEmoji(current.weather_code)}
          </div>

          <h2>{Math.round(current.temperature_2m)}°C</h2>
          <p className="condition-main">{getWeatherLabel(current.weather_code)}</p>
          <p className="high-low-text">
            High: {Math.round(high)}° Low: {Math.round(low)}°
          </p>
        </div>
      </div>

      <div className="current-weather-footer">
        <p>{dayjs().format("dddd, DD MMM YYYY")}</p>
        <p>Feels like {Math.round(current.apparent_temperature)}°C</p>
      </div>
    </div>
  );
}

export default CurrentWeatherCard;