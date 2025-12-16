function WeatherCard({ weather }) {
  if (!weather) return null;

  return (
    <div className="card p-3 text-center">
      <h3>{weather.name}</h3>
      <p>Temperature: {weather.main.temp} °C</p>
      <p>Weather: {weather.weather[0].description}</p>
      <p>Wind speed: {weather.wind.speed} m/s</p>
    </div>
  );
}

export default WeatherCard;
