import {
  CACHE_TTL,
  buildCityCacheKey,
  buildCoordsCacheKey,
  setCache,
  getCache,
  getStaleCache,
  removeCache,
  clearAllWeatherCache,
} from "./cacheService";

describe("cacheService", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(Date, "now").mockReturnValue(1000000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  test("buildCityCacheKey creates normalized city key", () => {
    const key = buildCityCacheKey("weather", "New York");
    expect(key).toBe("weather_city_new_york");
  });

  test("buildCoordsCacheKey creates lat/lon key", () => {
    const key = buildCoordsCacheKey("aqi", 17.385, 78.4867);
    expect(key).toBe("aqi_coords_17.3850_78.4867");
  });

  test("setCache and getCache return valid cached data", () => {
    const key = "weather_city_hyderabad";
    const data = {temp: 32};

    setCache(key, data, CACHE_TTL.WEATHER);

    const cached = getCache(key);
    expect(cached).toEqual(data);
  });

  test("getCache returns null if cache expired", () => {
    const key = "weather_city_hyderabad";
    const data = {temp: 32};

    setCache(key, data, 1000);

    Date.now.mockReturnValue(1000000 + 2000);

    const cached = getCache(key);
    expect(cached).toBeNull();
  });

  test("getStaleCache returns expired cached data", () => {
    const key = "weather_city_hyderabad";
    const data = {temp: 32};

    setCache(key, data, 1000);

    Date.now.mockReturnValue(1000000 + 2000);

    const stale = getStaleCache(key);
    expect(stale).toEqual(data);
  });

  test("removeCache deletes specific cache key", () => {
    const key = "weather_city_hyderabad";
    const data = {temp: 32};

    setCache(key, data, CACHE_TTL.WEATHER);
    removeCache(key);

    expect(getCache(key)).toBeNull();
  });

  test("clearAllWeatherCache removes all weather dashboard cache keys", () => {
    setCache("weather_city_hyderabad", {temp: 30}, CACHE_TTL.WEATHER);
    setCache("aqi_city_hyderabad", {aqi: 80}, CACHE_TTL.AQI);

    clearAllWeatherCache();

    expect(getCache("weather_city_hyderabad")).toBeNull();
    expect(getCache("aqi_city_hyderabad")).toBeNull();
  });
});