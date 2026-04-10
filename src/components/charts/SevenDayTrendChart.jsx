import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import {Line} from "react-chartjs-2";
import dayjs from "dayjs";
import "./SevenDayTrendChart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function SevenDayTrendChart({weatherData}) {
  if (!weatherData?.daily) return null;

  const labels = weatherData.daily.time.slice(0, 7).map(date =>
    dayjs(date).format("ddd")
  );

  const maxTemps = weatherData.daily.temperature_2m_max.slice(0, 7);
  const minTemps = weatherData.daily.temperature_2m_min.slice(0, 7);
  const avgTemps = maxTemps.map((max, index) =>
    Number(((max + minTemps[index]) / 2).toFixed(1))
  );

  const highestMax = Math.max(...maxTemps);
  const lowestMin = Math.min(...minTemps);
  const weeklyAvg = (
    avgTemps.reduce((sum, temp) => sum + temp, 0) / avgTemps.length
  ).toFixed(1);

  const warmestDay = labels[maxTemps.indexOf(highestMax)];
  const coolestDay = labels[minTemps.indexOf(lowestMin)];

  const data = {
    labels,
    datasets: [
      {
        label: "Max Temp (°C)",
        data: maxTemps,
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.18)",
        fill: false,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Min Temp (°C)",
        data: minTemps,
        borderColor: "#60a5fa",
        backgroundColor: "rgba(96, 165, 250, 0.18)",
        fill: false,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Avg Temp (°C)",
        data: avgTemps,
        borderColor: "#eab308",
        backgroundColor: "rgba(234, 179, 8, 0.18)",
        borderDash: [6, 6],
        fill: false,
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        labels: {
          color: "#374151",
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        callbacks: {
          label: context => ` ${context.dataset.label}: ${context.parsed.y}°C`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#6b7280",
          callback: value => `${value}°`,
        },
        grid: {
          color: "#eef2f7",
        },
      },
    },
  };

  return (
    <div className="chart-card-ui">
      <div className="chart-card-header-ui">
        <div>
          <h3>7-Day Temperature Trend</h3>
          <p className="chart-subtitle-ui">
            Daily max, min and average temperature forecast
          </p>
        </div>
        <span>🌤️</span>
      </div>

      <div className="chart-highlight-badge warm-cool-badge">
        <span>Warmest</span>
        <strong>{highestMax}°C</strong>
        <small>{warmestDay}</small>

        <span className="divider-dot">•</span>

        <span>Coolest</span>
        <strong>{lowestMin}°C</strong>
        <small>{coolestDay}</small>

        <span className="divider-dot">•</span>

        <span>Weekly Avg</span>
        <strong>{weeklyAvg}°C</strong>
      </div>

      <div className="chart-box-ui extra-wide-chart-box">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default SevenDayTrendChart;