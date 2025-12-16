function SearchBar({ city, setCity, onSearch, onKeyPress, disabled }) {
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Enter city name (e.g., London, Paris, New York)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={onKeyPress}
          disabled={disabled}
          aria-label="City search"
        />
      </div>
      <button 
        className="search-btn" 
        onClick={onSearch}
        disabled={disabled}
        aria-label="Get current weather"
      >
        <span className="btn-icon">🌤️</span>
        <span className="btn-text">Get Weather</span>
      </button>
    </div>
  );
}

export default SearchBar;
