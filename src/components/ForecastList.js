function getIcon(main) {
  if (main === "Clear") return "☀️";
  if (main === "Clouds") return "☁️";
  if (main === "Rain") return "🌧️";
  if (main === "Snow") return "❄️";
  if (main === "Thunderstorm") return "⛈️";
  return "🌤️";
}

function ForecastList({ forecast }) {
  if (!forecast || !forecast.list) return null;

  return (
    <div className="forecast-section mt-5">
      <h2 className="forecast-title">5-Day / 3-Hour Forecast</h2>

      <div className="forecast-grid">
        {forecast.list.slice(0, 10).map((item, index) => (
          <div key={index} className="forecast-card">
            <div className="forecast-time">
              {new Date(item.dt_txt).toLocaleString()}
            </div>

            <div className="forecast-icon">
              {getIcon(item.weather[0].main)}
            </div>

            <div className="forecast-temp">
              {item.main.temp} °C
            </div>

            <div className="forecast-desc">
              {item.weather[0].description}
            </div>

            <div className="forecast-wind">
              💨 {item.wind.speed} m/s
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForecastList;
