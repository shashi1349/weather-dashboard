import ForecastDayCard from "./ForecastDayCard";
import "./ForecastCardsSection.css";

function ForecastCardsSection({
  weatherData,
  onScrollToHourly,
  onScrollToPrecipitation,
}) {
  if (!weatherData?.daily) return null;

  const dailyForecasts = weatherData.daily.time.map((date, index) => ({
  date,
  maxTemp: weatherData.daily.temperature_2m_max?.[index] ?? "--",
  minTemp: weatherData.daily.temperature_2m_min?.[index] ?? "--",
  precipitation: weatherData.daily.precipitation_probability_max?.[index] ?? 0,
  weatherCode: weatherData.daily.weather_code?.[index] ?? 0,
}));

  return (
    <div className="forecast-section-ui">
      <div className="forecast-section-header">
        <h3>Forecast</h3>
        <div className="forecast-header-actions">⋮</div>
      </div>

      <div className="forecast-city-tabs">
        <button className="active-tab">14 Days</button>
        <button onClick={onScrollToHourly}>Hourly</button>
        <button onClick={onScrollToPrecipitation}>Precipitation</button>
      </div>

      <div className="forecast-scroll-wrapper">
        <div className="forecast-cards-scroll">
          {dailyForecasts.slice(0, 14).map((item, index) => (
            <ForecastDayCard key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ForecastCardsSection;