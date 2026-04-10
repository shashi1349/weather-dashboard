import "./MiniStatCard.css";

function MiniStatCard({title, value, subtitle, icon}) {
  return (
    <div className="mini-stat-card-ui">
      <div className="mini-stat-icon-box">{icon}</div>
      <p className="mini-stat-title-ui">{title}</p>
      <h4>{value}</h4>
      <p className="mini-stat-subtitle-ui">{subtitle}</p>
    </div>
  );
}

export default MiniStatCard;