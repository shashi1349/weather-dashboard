import dayjs from "dayjs";

export const getNextHourlyWindow = (weatherData, hours = 48) => {
  if (!weatherData?.hourly?.time) return [];

  const now = dayjs();
  const roundedNow =
    now.minute() > 0 ? now.add(1, "hour").startOf("hour") : now.startOf("hour");

  const times = weatherData.hourly.time;
  const temps = weatherData.hourly.temperature_2m || [];
  const rain = weatherData.hourly.precipitation_probability || [];
  const visibility = weatherData.hourly.visibility || [];
  const codes = weatherData.hourly.weather_code || [];

  const startIndex = times.findIndex(time =>
    dayjs(time).isSame(roundedNow, "hour")
  );

  if (startIndex === -1) return [];

  return times.slice(startIndex, startIndex + hours).map((time, index) => ({
    time,
    label: dayjs(time).format("DD MMM • hh:mm A"),
    shortLabel: dayjs(time).format("hh:mm A"),
    temperature: temps[startIndex + index],
    rainProbability: rain[startIndex + index],
    visibility: visibility[startIndex + index],
    weatherCode: codes[startIndex + index],
  }));
};