import "./Loader.css";

function Loader() {
  return (
    <div className="loader-box">
      <div className="loader-spinner"></div>
      <p>Loading weather data...</p>
    </div>
  );
}

export default Loader;