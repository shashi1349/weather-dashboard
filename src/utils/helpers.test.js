import {generateCustomAlerts} from "./helpers";

describe("generateCustomAlerts", () => {
  test("returns heat alert when temperature is high", () => {
    const weather = {
      current: {
        temperature_2m: 41,
        wind_speed_10m: 10,
      },
      hourly: {
        precipitation_probability: [10],
      },
    };

    const aqi = {
      current: {
        us_aqi: 50,
      },
    };

    const alerts = generateCustomAlerts(weather, aqi);

    expect(alerts.some(alert => alert.title.toLowerCase().includes("heat"))).toBe(true);
  });

  test("returns rain alert when rain probability is high", () => {
    const weather = {
      current: {
        temperature_2m: 28,
        wind_speed_10m: 10,
      },
      hourly: {
        precipitation_probability: [85],
      },
    };

    const aqi = {
      current: {
        us_aqi: 40,
      },
    };

    const alerts = generateCustomAlerts(weather, aqi);

    expect(alerts.some(alert => alert.title.toLowerCase().includes("rain"))).toBe(true);
  });

  test("returns air quality alert when AQI is unhealthy", () => {
    const weather = {
      current: {
        temperature_2m: 28,
        wind_speed_10m: 10,
      },
      hourly: {
        precipitation_probability: [10],
      },
    };

    const aqi = {
      current: {
        us_aqi: 170,
      },
    };

    const alerts = generateCustomAlerts(weather, aqi);

    expect(alerts.some(alert => alert.title.toLowerCase().includes("air"))).toBe(true);
  });

  test("returns empty array when conditions are normal", () => {
    const weather = {
      current: {
        temperature_2m: 28,
        wind_speed_10m: 10,
      },
      hourly: {
        precipitation_probability: [10],
      },
    };

    const aqi = {
      current: {
        us_aqi: 40,
      },
    };

    const alerts = generateCustomAlerts(weather, aqi);

    expect(alerts).toEqual([]);
  });
});