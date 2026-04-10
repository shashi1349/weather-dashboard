import {getAQILabel} from "../../utils/EmojiHelpers";
import "./AQICard.css";

function AQICard({aqi}) {
  const normalizedLevel =
    aqi <= 50 ? 1 :
    aqi <= 100 ? 2 :
    aqi <= 150 ? 3 :
    aqi <= 200 ? 4 : 5;

  return (
    <div className="aqi-card-ui">
      <div className="aqi-card-header">
        <h3>Air Quality Index</h3>
        <span>🌿</span>
      </div>

      <div className="aqi-main-value">{aqi || "N/A"}</div>

      <p className="aqi-label">{getAQILabel(aqi || 0)}</p>

      <div className="aqi-bars">
        <div className={`aqi-bar ${normalizedLevel >= 1 ? "active" : ""}`}></div>
        <div className={`aqi-bar ${normalizedLevel >= 2 ? "active" : ""}`}></div>
        <div className={`aqi-bar ${normalizedLevel >= 3 ? "active" : ""}`}></div>
        <div className={`aqi-bar ${normalizedLevel >= 4 ? "active" : ""}`}></div>
        <div className={`aqi-bar ${normalizedLevel >= 5 ? "active" : ""}`}></div>
      </div>
    </div>
  );
}

export default AQICard;