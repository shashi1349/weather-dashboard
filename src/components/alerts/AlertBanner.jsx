import "./AlertBanner.css";

function AlertBanner({alerts}) {
  const firstAlert = alerts?.[0];

  return (
    <div className="alert-card-ui">
      <div className="alert-card-header">
        <h3>Weather Alerts</h3>
        <span>⚠️</span>
      </div>

      {firstAlert ? (
        <>
          <h4>{firstAlert.title}</h4>
          <p>{firstAlert.message}</p>
        </>
      ) : (
        <>
          <h4>No Severe Alerts</h4>
          <p>Weather conditions look stable for now.</p>
        </>
      )}
    </div>
  );
}

export default AlertBanner;