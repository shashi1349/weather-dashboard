import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {getNextHourlyWindow} from "../../utils/hourlyUtils";

function PrecipitationChart({weatherData}) {
  const chartData = getNextHourlyWindow(weatherData, 48);

  if (!chartData.length) return null;

  const maxRain = Math.max(...chartData.map(item => item.rainProbability));
  const maxRainHour = chartData.find(item => item.rainProbability === maxRain)?.label;

  return (
    <div id="precipitation-chart" className="chart-card-ui">
      <div className="chart-card-header-ui">
        <div>
          <h3>Chance of Rain (Next 48 Hours)</h3>
          <p className="chart-subtitle-ui">
            From {chartData[0]?.label} to {chartData[chartData.length - 1]?.label}
          </p>
        </div>
        <span>🌧️</span>
      </div>

      <div className="chart-highlight-badge green-badge">
        <span>Highest Rain Chance</span>
        <strong>{maxRain}%</strong>
        <small>at {maxRainHour}</small>
      </div>

      <div className="chart-box-ui full-width-chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
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
              formatter={value => [`${value}%`, "Rain Probability"]}
              labelFormatter={label => `${label}`}
            />
            <Legend />
            <Bar
              dataKey="rainProbability"
              fill="#9ad8ad"
              radius={[8, 8, 0, 0]}
              name="Rain Probability (%)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PrecipitationChart;