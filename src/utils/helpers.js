export const generateCustomAlerts = (weather, aqi) => {
  const alerts = [];

  const currentTemp = weather?.current?.temperature_2m ?? 0;
  const rainChance = weather?.hourly?.precipitation_probability?.[0] ?? 0;
  const airQuality = aqi?.current?.us_aqi ?? 0;

  if (currentTemp >= 40) {
    alerts.push({
      title: "Heat Alert",
      message: "Temperature is very high today. Stay hydrated and avoid direct sun.",
    });
  }

  if (rainChance >= 70) {
    alerts.push({
      title: "Rain Alert",
      message: "High chance of rain expected soon. Carry an umbrella if heading out.",
    });
  }

  if (airQuality >= 150) {
    alerts.push({
      title: "Air Quality Alert",
      message: "Air quality is unhealthy. Consider limiting outdoor activity.",
    });
  }

  return alerts;
};