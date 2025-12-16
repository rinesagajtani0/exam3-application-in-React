function SearchBar({ city, setCity, onSearch }) {
  return (
    <div className="d-flex gap-2 mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Enter city (e.g. London)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button className="btn btn-primary" onClick={onSearch}>
        Current Weather
      </button>
    </div>
  );
}

export default SearchBar;
