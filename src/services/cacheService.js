const CACHE_PREFIX = "weather_dashboard_cache";

export const CACHE_TTL = {
  WEATHER: 15 * 60 * 1000, // 15 min
  AQI: 30 * 60 * 1000, // 30 min
  HISTORICAL: 24 * 60 * 60 * 1000, // 24 hrs
};

const buildStorageKey = key => `${CACHE_PREFIX}_${key}`;

export const buildCityCacheKey = (type, city) =>
  `${type}_city_${city?.trim().toLowerCase().replace(/\s+/g, "_")}`;

export const buildCoordsCacheKey = (type, lat, lon) =>
  `${type}_coords_${Number(lat).toFixed(4)}_${Number(lon).toFixed(4)}`;

export const setCache = (key, data, ttl = CACHE_TTL.WEATHER) => {
  const payload = {
    data,
    timestamp: Date.now(),
    expiresAt: Date.now() + ttl,
  };

  localStorage.setItem(buildStorageKey(key), JSON.stringify(payload));
};

export const getCache = key => {
  try {
    const raw = localStorage.getItem(buildStorageKey(key));
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (Date.now() > parsed.expiresAt) {
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error("Cache read error:", error);
    return null;
  }
};

export const getStaleCache = key => {
  try {
    const raw = localStorage.getItem(buildStorageKey(key));
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed.data || null;
  } catch (error) {
    console.error("Stale cache read error:", error);
    return null;
  }
};

export const removeCache = key => {
  localStorage.removeItem(buildStorageKey(key));
};

export const clearAllWeatherCache = () => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(CACHE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
};