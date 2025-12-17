import { useState, useEffect, useRef } from "react";
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

  const [recentCities, setRecentCities] = useState([]);
  const [favoriteCities, setFavoriteCities] = useState([]);

  const didAutoSelectFavorite = useRef(false);

  useEffect(() => {
    if (dark) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [dark]);

  useEffect(() => {
    const recent = localStorage.getItem("recentCities");
    const favorites = localStorage.getItem("favoriteCities");
    if (recent) setRecentCities(JSON.parse(recent));
    if (favorites) setFavoriteCities(JSON.parse(favorites));
  }, []);

  useEffect(() => {
    if (didAutoSelectFavorite.current) return;
    if (!weather && !city && favoriteCities.length > 0) {
      didAutoSelectFavorite.current = true;
      getCurrentWeather(favoriteCities[0]);
    }
  }, [favoriteCities]);

  const getCurrentWeather = async (customCity) => {
    const searchCity = customCity || city;

    if (!searchCity.trim()) {
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
          searchCity.trim()
        )}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );

      const data = await response.json();
      if (data.cod !== 200) throw new Error(data.message);

      setWeather(data);
      setCity(data.name);

      setRecentCities((prev) => {
        const updated = [
          data.name,
          ...prev.filter((c) => c !== data.name),
        ].slice(0, 6);

        localStorage.setItem("recentCities", JSON.stringify(updated));
        return updated;
      });
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") getCurrentWeather();
  };

  const toggleFavorite = (cityName) => {
    if (!cityName) return;
    setFavoriteCities((prev) => {
      const updated = prev.includes(cityName)
        ? prev.filter((c) => c !== cityName)
        : [cityName, ...prev];
      localStorage.setItem("favoriteCities", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFavorite = (cityName) => {
    setFavoriteCities((prev) => {
      const updated = prev.filter((c) => c !== cityName);
      localStorage.setItem("favoriteCities", JSON.stringify(updated));
      return updated;
    });
  };

  const removeRecent = (cityName) => {
    setRecentCities((prev) => {
      const updated = prev.filter((c) => c !== cityName);
      localStorage.setItem("recentCities", JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllRecent = () => {
    setRecentCities([]);
    localStorage.removeItem("recentCities");
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
              onSearch={() => getCurrentWeather()}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />

            {(recentCities.length > 0 || favoriteCities.length > 0) && (
              <div className="chips-block">
                {favoriteCities.length > 0 && (
                  <div className="chips-row">
                    <div className="chips-title">Favorites</div>
                    <div className="chips">
                      {favoriteCities.map((c) => (
                        <div key={c} className="chip chip-fav">
                          <button
                            type="button"
                            className="chip-main"
                            onClick={() => getCurrentWeather(c)}
                          >
                            ❤️ {c}
                          </button>
                          <button
                            type="button"
                            className="chip-x"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFavorite(c);
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recentCities.length > 0 && (
               <div className="chips-row">
                <div className="chips-title">Recent</div>

                <div className="chips chips-with-clear">
                  {recentCities.map((c) => (
                    <div key={c} className="chip chip-recent">
                      <button
                        type="button"
                        className="chip-main"
                        onClick={() => getCurrentWeather(c)}
                      >
                        📍 {c}
                      </button>
                      <button
                        type="button"
                        className="chip-x"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecent(c);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="chip chip-clear"
                    onClick={clearAllRecent}
                  >
                    🧹 Clear all
                  </button>
                </div>
              </div>
                )}
              </div>
            )}

            <div className="forecast-controls">
              <button
                className={`forecast-btn ${
                  showForecast && forecastType === "5day" ? "active" : ""
                }`}
                onClick={() => {
                  if (showForecast && forecastType === "5day")
                    setShowForecast(false);
                  else {
                    getForecast();
                    setForecastType("5day");
                  }
                }}
                disabled={loading}
              >
                📅 Show 5-Day Forecast
              </button>

              <button
                className={`forecast-btn ${
                  showForecast && forecastType === "hourly" ? "active" : ""
                }`}
                onClick={() => {
                  if (showForecast && forecastType === "hourly")
                    setShowForecast(false);
                  else {
                    getForecast();
                    setForecastType("hourly");
                  }
                }}
                disabled={loading}
              >
                ⏰ Show 3-Hour Forecast
              </button>
            </div>
          </div>

          {loading && <p className="text-center mt-4">Loading...</p>}
          {error && <p className="error-message">{error}</p>}

          <WeatherCard
            weather={weather}
            onToggleFavorite={() =>
              weather && toggleFavorite(weather.name)
            }
            isFavorite={
              !!(weather && favoriteCities.includes(weather.name))
            }
          />

          {showForecast && forecast && (
            <ForecastList forecast={forecast} type={forecastType} />
          )}

          {forecast && showForecast && (
            <DownloadButton
              data={forecast}
              filename="weather-forecast.json"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
