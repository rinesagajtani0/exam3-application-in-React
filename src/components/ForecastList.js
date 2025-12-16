function groupByDay(forecastList) {
  const grouped = {};
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    
    if (!grouped[dayKey]) {
      grouped[dayKey] = [];
    }
    grouped[dayKey].push(item);
  });
  
  return grouped;
}

function getDailySummary(dayData) {
  const temps = dayData.map(item => item.main.temp);
  const tempMin = Math.round(Math.min(...temps));
  const tempMax = Math.round(Math.max(...temps));
  
  const weatherCounts = {};
  dayData.forEach(item => {
    const weather = item.weather[0].main;
    weatherCounts[weather] = (weatherCounts[weather] || 0) + 1;
  });
  
  const mostCommon = Object.keys(weatherCounts).reduce((a, b) => 
    weatherCounts[a] > weatherCounts[b] ? a : b
  );
  
  const noonItem = dayData.find(item => {
    const hour = new Date(item.dt * 1000).getHours();
    return hour >= 11 && hour <= 14;
  }) || dayData[Math.floor(dayData.length / 2)];
  
  return {
    tempMin,
    tempMax,
    weather: mostCommon,
    description: noonItem.weather[0].description,
    icon: noonItem.weather[0].icon,
    humidity: Math.round(dayData.reduce((sum, item) => sum + item.main.humidity, 0) / dayData.length),
    windSpeed: (dayData.reduce((sum, item) => sum + item.wind.speed, 0) / dayData.length).toFixed(1)
  };
}

function ForecastList({ forecast, type }) {
  if (!forecast || !forecast.list) return null;

  if (type === '5day') {
    const groupedData = groupByDay(forecast.list);
    const days = Object.keys(groupedData).slice(0, 5);
    
    return (
      <div className="forecast-section">
        <h2 className="forecast-title">
          <span className="title-icon">📅</span>
          5-Day Weather Forecast
        </h2>
        
        <div className="forecast-5day-grid">
          {days.map((day, index) => {
            const summary = getDailySummary(groupedData[day]);
            const iconUrl = `https://openweathermap.org/img/wn/${summary.icon}@2x.png`;
            
            return (
              <div key={index} className="forecast-day-card">
                <div className="day-header">
                  <h3 className="day-name">{day}</h3>
                </div>
                
                <div className="day-icon">
                  <img src={iconUrl} alt={summary.description} loading="lazy" />
                </div>
                
                <div className="day-temp-range">
                  <span className="temp-max">{summary.tempMax}°</span>
                  <span className="temp-separator">/</span>
                  <span className="temp-min">{summary.tempMin}°</span>
                </div>
                
                <div className="day-description">{summary.description}</div>
                
                <div className="day-details">
                  <div className="day-detail">
                    <span className="detail-icon-small">💧</span>
                    <span>{summary.humidity}%</span>
                  </div>
                  <div className="day-detail">
                    <span className="detail-icon-small">💨</span>
                    <span>{summary.windSpeed} m/s</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === 'hourly') {
    const hourlyData = forecast.list.slice(0, 16); 
    
    return (
      <div className="forecast-section">
        <h2 className="forecast-title">
          <span className="title-icon">⏰</span>
          3-Hour Weather Forecast
        </h2>
        
        <div className="forecast-hourly-grid">
          {hourlyData.map((item, index) => {
            const date = new Date(item.dt * 1000);
            const time = date.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            });
            const dateStr = date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            });
            const temp = Math.round(item.main.temp);
            const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
            
            return (
              <div key={index} className="forecast-hour-card">
                <div className="hour-time">
                  <div className="time">{time}</div>
                  <div className="date">{dateStr}</div>
                </div>
                
                <div className="hour-icon">
                  <img src={iconUrl} alt={item.weather[0].description} loading="lazy" />
                </div>
                
                <div className="hour-temp">{temp}°C</div>
                
                <div className="hour-description">{item.weather[0].description}</div>
                
                <div className="hour-details">
                  <div className="hour-detail">
                    <span>💧 {item.main.humidity}%</span>
                  </div>
                  <div className="hour-detail">
                    <span>💨 {item.wind.speed} m/s</span>
                  </div>
                  {item.pop > 0 && (
                    <div className="hour-detail precipitation">
                      <span>🌧️ {Math.round(item.pop * 100)}%</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}

export default ForecastList;
