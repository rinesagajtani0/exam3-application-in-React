import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const getCurrentWeather = async () => {
    if (!city.trim()) return;

    try {
      setError("");
      setWeather(null);

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city.trim()
        )}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
      );

      const data = await response.json();

      if (response.status === 401) {
        throw new Error(
          "API key not active yet. Please wait a few minutes and try again."
        );
      }

      if (data.cod !== 200) {
        throw new Error(data.message);
      }

      setWeather(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Weather Forecast App</h1>

      <SearchBar
        city={city}
        setCity={setCity}
        onSearch={getCurrentWeather}
      />

      {error && <p className="text-danger text-center">{error}</p>}

      <WeatherCard weather={weather} />
    </div>
  );
}

export default App;
