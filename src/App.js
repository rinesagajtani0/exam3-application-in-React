import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastList from "./components/ForecastList";
import DownloadButton from "./components/DownloadButton";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");

  const getCurrentWeather = async () => {
    if (!city.trim()) return;

    try {
      setError("");
      setWeather(null);
      setForecast(null);

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city.trim()
        )}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );

      const data = await response.json();

      if (data.cod !== 200) throw new Error(data.message);

      setWeather(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const getForecast = async () => {
    if (!city.trim()) return;

    try {
      setError("");
      setWeather(null);
      setForecast(null);

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          city.trim()
        )}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );

      const data = await response.json();

      if (data.cod !== "200") throw new Error(data.message);

      setForecast(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Weather Forecast App</h1>

      <div className="mb-3">
        <SearchBar city={city} setCity={setCity} onSearch={getCurrentWeather} />
        <button className="btn btn-secondary w-100" onClick={getForecast}>
          5-Day / 3-Hour Forecast
        </button>
      </div>

      {error && <p className="text-danger text-center">{error}</p>}

      <WeatherCard weather={weather} />
      <ForecastList forecast={forecast} />
      <DownloadButton data={forecast} filename="forecast.json" />
    </div>
  );
}

export default App;
