import {fetchWithRetry} from "./apiClient";

const ARCHIVE_BASE_URL = "https://archive-api.open-meteo.com/v1/archive";

export const getHistoricalMonthlyAverage = async (lat, lon, timezone = "auto") => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const startYear = currentYear - 5;
  const endYear = currentYear - 1;

  const requests = [];

  for (let year = startYear; year <= endYear; year++) {
    const startDate = `${year}-${String(currentMonth).padStart(2, "0")}-01`;
    const lastDay = new Date(year, currentMonth, 0).getDate();
    const endDate = `${year}-${String(currentMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    const url = `${ARCHIVE_BASE_URL}?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean&timezone=${timezone}`;

    requests.push(fetchWithRetry(url));
  }

  const results = await Promise.all(requests);

  let allTemps = [];

  results.forEach(item => {
    if (item?.daily?.temperature_2m_mean) {
      allTemps = [...allTemps, ...item.daily.temperature_2m_mean];
    }
  });

  if (allTemps.length === 0) {
    throw new Error("Unable to calculate historical monthly average");
  }

  const average =
    allTemps.reduce((sum, value) => sum + value, 0) / allTemps.length;

  return Number(average.toFixed(1));
};