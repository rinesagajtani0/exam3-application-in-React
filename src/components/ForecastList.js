function ForecastList({ forecast }) {
  if (!forecast || !forecast.list) return null;

  return (
    <div className="mt-4">
      <h3 className="text-center mb-3">5-Day / 3-Hour Forecast</h3>

      <div className="row">
        {forecast.list.slice(0, 10).map((item, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4 mb-3">
            <div className="card p-3 text-center h-100">
              <p className="fw-bold">
                {new Date(item.dt_txt).toLocaleString()}
              </p>
              <p>{item.main.temp} °C</p>
              <p>{item.weather[0].description}</p>
              <p>{item.wind.speed} m/s</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForecastList;
