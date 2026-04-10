import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {getHistoricalMonthlyAverage} from "../../services/historicalWeatherService";
import {
  CACHE_TTL,
  buildCoordsCacheKey,
  getCache,
  getStaleCache,
  setCache,
} from "../../services/cacheService";
import "./HistoricalComparisonCard.css";

function HistoricalComparisonCard({currentTemp, lat, lon, timezone}) {
  const [historicalAverage, setHistoricalAverage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!lat || !lon) return;

      const currentMonth = dayjs().format("YYYY_MM");
      const historicalKey = `${buildCoordsCacheKey("historical", lat, lon)}_${currentMonth}`;

      try {
        setLoading(true);

        const cachedHistorical = getCache(historicalKey);

        if (cachedHistorical !== null) {
          setHistoricalAverage(cachedHistorical);
          setLoading(false);
          return;
        }

        const avg = await getHistoricalMonthlyAverage(lat, lon, timezone);
        setHistoricalAverage(avg);

        setCache(historicalKey, avg, CACHE_TTL.HISTORICAL);
      } catch (error) {
        console.error("Historical comparison error:", error);

        const staleHistorical = getStaleCache(historicalKey);

        if (staleHistorical !== null) {
          setHistoricalAverage(staleHistorical);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [lat, lon, timezone]);

  if (loading) {
    return (
      <div className="historical-card-ui">
        <div className="historical-header-ui">
          <h3>Historical Comparison</h3>
          <span>📊</span>
        </div>
        <p>Loading historical data...</p>
      </div>
    );
  }

  if (historicalAverage === null) {
    return (
      <div className="historical-card-ui">
        <div className="historical-header-ui">
          <h3>Historical Comparison</h3>
          <span>📊</span>
        </div>
        <p>Historical data unavailable.</p>
      </div>
    );
  }

  const currentMonth = dayjs().format("MMMM");
  const difference = (currentTemp - historicalAverage).toFixed(1);

  const isWarmer = difference > 0;
  const isCooler = difference < 0;

  return (
    <div className="historical-card-ui">
      <div className="historical-header-ui">
        <h3>Historical Comparison</h3>
        <span>📊</span>
      </div>

      <div className="historical-grid-ui">
        <div className="historical-box-ui">
          <p>Today's Temp</p>
          <h4>{Math.round(currentTemp)}°C</h4>
        </div>

        <div className="historical-box-ui">
          <p>{currentMonth} Avg</p>
          <h4>{historicalAverage}°C</h4>
        </div>

        <div className="historical-box-ui">
          <p>Difference</p>
          <h4 className={isWarmer ? "warmer" : isCooler ? "cooler" : "normal"}>
            {difference > 0 ? `+${difference}` : difference}°C
          </h4>
        </div>
      </div>

      <p className="historical-summary-ui">
        {isWarmer && `It is ${difference}°C warmer than the 5-year monthly average.`}
        {isCooler && `It is ${Math.abs(difference)}°C cooler than the 5-year monthly average.`}
        {!isWarmer &&
          !isCooler &&
          "Today's temperature matches the 5-year monthly average."}
      </p>
    </div>
  );
}

export default HistoricalComparisonCard;