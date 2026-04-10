import "./LocationButton.css";

function LocationButton({onUseLocation}) {
  return (
    <button className="location-btn-ui" onClick={onUseLocation}>
      📍 Use My Location
    </button>
  );
}

export default LocationButton;