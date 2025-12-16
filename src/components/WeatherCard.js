function WeatherCard({ weather }) {
  if (!weather) return null;

  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const tempMin = Math.round(weather.main.temp_min);
  const tempMax = Math.round(weather.main.temp_max);

  const iconCode = weather.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  return (
    <div className="weather-card">
      <div className="weather-card-header">
        <div className="location-info">
          <h2 className="city-name">{weather.name}</h2>
          <p className="country-name">{weather.sys.country}</p>
        </div>
        <div className="current-date">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <div className="weather-card-main">
        <div className="weather-icon-large">
          <img src={iconUrl} alt={weather.weather[0].description} loading="lazy" />
        </div>
        <div className="temperature-main">
          <span className="temp-value">{temp}</span>
          <span className="temp-unit">°C</span>
        </div>
        <div className="weather-description">
          {weather.weather[0].description}
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <div className="detail-icon">🌡️</div>
          <div className="detail-content">
            <div className="detail-label">Feels Like</div>
            <div className="detail-value">{feelsLike}°C</div>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">💧</div>
          <div className="detail-content">
            <div className="detail-label">Humidity</div>
            <div className="detail-value">{weather.main.humidity}%</div>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">💨</div>
          <div className="detail-content">
            <div className="detail-label">Wind Speed</div>
            <div className="detail-value">{weather.wind.speed} m/s</div>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">🌡️</div>
          <div className="detail-content">
            <div className="detail-label">Min / Max</div>
            <div className="detail-value">{tempMin}° / {tempMax}°</div>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">🔽</div>
          <div className="detail-content">
            <div className="detail-label">Pressure</div>
            <div className="detail-value">{weather.main.pressure} hPa</div>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">👁️</div>
          <div className="detail-content">
            <div className="detail-label">Visibility</div>
            <div className="detail-value">{(weather.visibility / 1000).toFixed(1)} km</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
