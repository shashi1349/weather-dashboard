import dayjs from "dayjs";
import {getWeatherEmoji, getWeatherLabel} from "../../utils/EmojiHelpers";
import "./ForecastDayCard.css";

function ForecastDayCard({item}) {
  if (!item) return null;

  return (
    <div className="forecast-day-card-ui">
      <p className="forecast-day-title">{dayjs(item.date).format("ddd")}</p>
      <p className="forecast-day-date">{dayjs(item.date).format("DD")}</p>

      <div className="forecast-weather-emoji">
        {getWeatherEmoji(item.weatherCode)}
      </div>

      <h4>{Math.round(item.maxTemp)}°C</h4>
      <p className="forecast-day-condition">{getWeatherLabel(item.weatherCode)}</p>
      <p className="forecast-day-min">Low: {Math.round(item.minTemp)}°</p>
    </div>
  );
}

export default ForecastDayCard;