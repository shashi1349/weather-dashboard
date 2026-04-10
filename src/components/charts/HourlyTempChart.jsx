import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {getNextHourlyWindow} from "../../utils/hourlyUtils";

function HourlyTempChart({weatherData}) {
  const chartData = getNextHourlyWindow(weatherData, 48);

  if (!chartData.length) return null;

  const peakTemp = Math.max(...chartData.map(item => item.temperature));
  const peakHour = chartData.find(item => item.temperature === peakTemp)?.label;

  return (
    <div id="hourly-chart" className="chart-card-ui">
      <div className="chart-card-header-ui">
        <div>
          <h3>Hourly Temperature (Next 48 Hours)</h3>
          <p className="chart-subtitle-ui">
            From {chartData[0]?.label} to {chartData[chartData.length - 1]?.label}
          </p>
        </div>
        <span>📈</span>
      </div>

      <div className="chart-highlight-badge">
        <span>Peak Temp</span>
        <strong>{peakTemp.toFixed(1)}°C</strong>
        <small>at {peakHour}</small>
      </div>

      <div className="chart-box-ui full-width-chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
            <XAxis
              dataKey="shortLabel"
              interval={1}
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{fontSize: 11}}
            />
            <YAxis />
            <Tooltip
              formatter={value => [`${value}°C`, "Temperature"]}
              labelFormatter={label => `${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#55b4f5"
              strokeWidth={3}
              dot={{r: 3}}
              activeDot={{r: 6}}
              name="Temperature (°C)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default HourlyTempChart;