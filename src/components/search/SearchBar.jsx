import {useState} from "react";
import {FiSearch} from "react-icons/fi";
import "./SearchBar.css";

function SearchBar({onSearch}) {
  const [city, setCity] = useState("");

  const handleSubmit = e => {
    e.preventDefault();

    if (!city.trim()) return;
    onSearch(city.trim());
  };

  return (
    <form className="search-bar-wrap" onSubmit={handleSubmit}>
      <FiSearch className="search-bar-icon" />
      <input
        type="text"
        placeholder="Search your location"
        value={city}
        onChange={e => setCity(e.target.value)}
      />
    </form>
  );
}

export default SearchBar;