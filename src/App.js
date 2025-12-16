import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastList from "./components/ForecastList";
import DownloadButton from "./components/DownloadButton";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  const [forecastType, setForecastType] = useState("5day"); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [dark]);

  const getCurrentWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setWeather(null);
      setShowForecast(false);

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city.trim()
        )}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );

      const data = await response.json();

      if (data.cod !== 200) throw new Error(data.message);

      setWeather(data);
    } catch (err) {
      setError(err.message || "Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const getForecast = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setWeather(null);

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          city.trim()
        )}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );

      const data = await response.json();

      if (data.cod !== "200") throw new Error(data.message);

      setForecast(data);
      setShowForecast(true);
    } catch (err) {
      setError(err.message || "Failed to fetch forecast data");
    } finally {
      setLoading(false);
    }
  };

  const toggleForecast = () => {
    setShowForecast(!showForecast);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      getCurrentWeather();
    }
  };

  return (
    <div className="app-container">
      <div className="container py-4 py-md-5">
        <div className="app-wrapper">
          <header className="app-header">
            <div className="header-content">
              <div className="logo-section">
                <div className="weather-icon-header">🌤️</div>
                <h1 className="app-title">Weather Forecast</h1>
              </div>
              <button
                className="theme-toggle"
                onClick={() => setDark(!dark)}
                aria-label="Toggle theme"
              >
                <span className="theme-icon">{dark ? "☀️" : "🌙"}</span>
              </button>
            </div>
          </header>

          <div className="search-section">
            <SearchBar
              city={city}
              setCity={setCity}
              onSearch={getCurrentWeather}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            
            <div className="forecast-controls">
              <button 
                className={`forecast-btn ${showForecast && forecastType === '5day' ? 'active' : ''}`}
                onClick={() => {
                  if (showForecast && forecastType === '5day') {
                    setShowForecast(false);
                  } else {
                    getForecast();
                    setForecastType('5day');
                  }
                }}
                disabled={loading}
              >
                <span className="btn-icon">📅</span>
                <span>{showForecast && forecastType === '5day' ? 'Hide' : 'Show'} 5-Day Forecast</span>
              </button>
              
              <button 
                className={`forecast-btn ${showForecast && forecastType === 'hourly' ? 'active' : ''}`}
                onClick={() => {
                  if (showForecast && forecastType === 'hourly') {
                    setShowForecast(false);
                  } else {
                    getForecast();
                    setForecastType('hourly');
                  }
                }}
                disabled={loading}
              >
                <span className="btn-icon">⏰</span>
                <span>{showForecast && forecastType === 'hourly' ? 'Hide' : 'Show'} 3-Hour Forecast</span>
              </button>
            </div>
          </div>

          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading weather data...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <WeatherCard weather={weather} />

          {showForecast && forecast && (
            <ForecastList 
              forecast={forecast} 
              type={forecastType}
            />
          )}

          {forecast && showForecast && (
            <DownloadButton data={forecast} filename="weather-forecast.json" />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
