// ---------- Weather Code to Label ----------
export const getWeatherLabel = code => {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Storm";
  return "Cloudy";
};

// ---------- Weather Code to Emoji ----------
export const getWeatherEmoji = code => {
  if (code === 0) return "☀️";
  if ([1, 2, 3].includes(code)) return "⛅";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "☁️";
};

// ---------- AQI Label ----------
export const getAQILabel = value => {
  if (value <= 50) return "Good";
  if (value <= 100) return "Moderate";
  if (value <= 150) return "Unhealthy for Sensitive Groups";
  if (value <= 200) return "Unhealthy";
  if (value <= 300) return "Very Unhealthy";
  return "Hazardous";
};

// ---------- Custom Alerts ----------
export const generateCustomAlerts = (weatherData, aqiData) => {
  const alerts = [];

  const currentTemp = weatherData?.current?.temperature_2m;
  const maxDailyTemp = weatherData?.daily?.temperature_2m_max?.[0];
  const rainProb = weatherData?.daily?.precipitation_probability_max?.[0];
  const maxWind = weatherData?.daily?.wind_speed_10m_max?.[0];
  const aqi = aqiData?.current?.us_aqi;

  if (currentTemp >= 38 || maxDailyTemp >= 40) {
    alerts.push({
      title: "Heat Alert",
      message: "High temperature expected today. Stay hydrated and avoid direct sunlight.",
    });
  }

  if (rainProb >= 70) {
    alerts.push({
      title: "Heavy Rain Probability",
      message: "There is a high chance of rain today. Carry an umbrella if you're going out.",
    });
  }

  if (maxWind >= 35) {
    alerts.push({
      title: "Strong Wind Alert",
      message: "Strong winds are expected today. Secure loose outdoor items.",
    });
  }

  if (aqi >= 151) {
    alerts.push({
      title: "Air Quality Warning",
      message: "Air quality is unhealthy. Consider reducing outdoor activity.",
    });
  }

  return alerts;
};