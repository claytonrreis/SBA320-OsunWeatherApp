import React, { useState, useEffect } from "react";
import clearDay from "../assets/images/ClearDay.png";
import clearNight from "../assets/images/ClearNight.png";
import cloudyDay from "../assets/images/CloudyDay.png";
import cloudyNight from "../assets/images/CloudyNight.png";
import rainyDay from "../assets/images/Rainy.png";
import rainyNigth from "../assets/images/Rainy.png";
import snowyDay from "../assets/images/Snowy.png";
import snowyNigth from "../assets/images/Snowy.png";
import hazyDay from "../assets/images/Hazy.png";
import hazyNigth from "../assets/images/Hazy.png";
import stormyDay from "../assets/images/Stormy.png";
import stormyNigth from "../assets/images/Stormy.png";
import defaultImage from "../assets/images/infinityloading.gif";
import loadingg from "../assets/images/loadingg.gif";

function OsunWeatherApp() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [unitSystem, setUnitSystem] = useState("Imperial");

  // const apikey = import.meta.env.VITE_YOUR_API_KEY;

  const apikey = "f5eca65e7d5ec27e969d394aa4201e80";

  const handleLocation = (e) => {
    setLocation(e.target.value);
  };

  const fetchWeather = async (unit) => {
    setLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${
      location || "Chicago"
    }&units=${unit}&appid=${apikey}`;

    try {
      const res = await fetch(url);
      const weatherData = await res.json();

      if (res.ok && weatherData.cod === 200) {
        setData({ ...weatherData, notFound: false });
      } else {
        setData({ notFound: true });
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setData({ notFound: true });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchWeather(unitSystem);
  }, [unitSystem]);

  const searchWeather = async () => {
    if (location.trim() !== "") {
      await fetchWeather(unitSystem);
      setLocation("");
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      searchWeather();
    }
  };

  const toggleUnitSystem = () => {
    setUnitSystem((prev) => (prev === "Imperial" ? "Metric" : "Imperial"));
  };

  const weatherTypes = {
    Clear: { day: clearDay, night: clearNight },
    Clouds: { day: cloudyDay, night: cloudyNight },
    Rain: { day: rainyDay, night: rainyNigth },
    Thunderstorm: { day: stormyDay, night: stormyNigth },
    Snow: { day: snowyDay, night: snowyNigth },
    Haze: { day: hazyDay, night: hazyNigth },
    Mist: { day: hazyDay, night: hazyNigth },
    Fog: { day: hazyDay, night: hazyNigth },
    Drizzle: { day: rainyDay, night: rainyNigth },
  };

  const getTimeOfDay = (sunrise, sunset, dt) => {
    const date = new Date(dt * 1000);
    const sunriseTime = new Date(sunrise * 1000);
    const sunsetTime = new Date(sunset * 1000);
    return date >= sunriseTime && date <= sunsetTime ? "day" : "night";
  };

  const weatherType = (data.weather && data.weather.length > 0
    ? weatherTypes[data.weather[0].main]
    : { day: defaultImage, night: defaultImage }) || {
    day: defaultImage,
    night: defaultImage,
  };

  const timeOfDay =
    (data.sys && getTimeOfDay(data.sys.sunrise, data.sys.sunset, data.dt)) ||
    "day";
  const currentWeatherImage = weatherType[timeOfDay] || defaultImage;

  const backgroundImages = {
    Clear: "linear-gradient(135deg, rgb(161, 205, 247), rgb(119, 170, 247))",
    Clouds: "linear-gradient(135deg, rgb(182, 208, 233), rgb(138, 169, 214))",
    Rain: "linear-gradient(135deg, rgb(148, 237, 243), rgb(207, 207, 207))",
    Snow: "linear-gradient(135deg, rgb(255, 255, 255), rgb(114, 216, 247))",
    Haze: "linear-gradient(135deg, white, rgb(175, 175, 175))",
    Mist: "linear-gradient(135deg, white, rgb(175, 175, 175))",
    Fog: "linear-gradient(135deg, white, rgb(175, 175, 175))",
    Drizzle: "linear-gradient(135deg, rgb(207, 207, 207), rgb(148, 237, 243))",
    Thunderstorm:
      "linear-gradient(135deg, rgb(151, 144, 144), rgb(185, 200, 202))",
  };

  const backgroundImage =
    (data.weather && data.weather.length > 0
      ? backgroundImages[data.weather[0].main]
      : "linear-gradient(to top, rgb(250, 184, 97), lightyellow)") ||
    "linear-gradient(to top, rgb(250, 184, 97), lightyellow)";

  const currentDate = new Date();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  const month = months[currentDate.getMonth()];
  const dayOfMonth = currentDate.getDate();
  const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}`;

  return (
    <div className="container" style={{ backgroundImage }}>
      <div
        className="clearskies-app"
        style={{
          backgroundImage:
            backgroundImage && backgroundImage.replace
              ? backgroundImage.replace("135deg", "315deg")
              : null,
        }}
      >
        <div className="search">
          <div className="search-top">
            <i className="fa-solid fa-location-dot"></i>
            <div className="location">{data.name || "Unknown Location"}</div>
            <button className="switch" onClick={toggleUnitSystem}>
              {unitSystem === "Imperial" ? "°C" : "°F"}
            </button>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter location..."
              value={location}
              onChange={handleLocation}
              onKeyDown={handleEnter}
            />
            <i
              className="fa-solid fa-magnifying-glass"
              onClick={searchWeather}
            ></i>
          </div>
        </div>
        {loading ? (
          <img className="loader" src={loadingg} alt="loading" />
        ) : data.notFound ? (
          <div className="not-found">Not Found 🤔</div>
        ) : (
          <>
            <div className="weather">
              <img src={currentWeatherImage} alt="weather" />
              <div className="weather-type">
                {data.weather && data.weather.length > 0
                  ? data.weather[0].main
                  : "Unknown"}
              </div>
              <div className="temp">
                {data.main ? `${Math.floor(data.main.temp)}°` : "N/A"}
              </div>
            </div>
            <div className="weather-date">
              <p>{formattedDate}</p>
            </div>
            <div className="weather-data">
              <div className="humidity">
                <div className="data-name">Humidity</div>
                <i className="fa-solid fa-droplet"></i>
                <div className="data">
                  {data.main ? `${data.main.humidity}%` : "N/A"}
                </div>
              </div>
              <div className="feels-like">
                <div className="data-name">Feels Like</div>
                <i className="fas fa-thermometer-half"></i>
                <div className="data">
                  {data.main ? `${Math.floor(data.main.feels_like)}°` : "N/A"}
                </div>
              </div>
              <div className="wind">
                <div className="data-name">Wind</div>
                <i className="fa-solid fa-wind"></i>
                <div className="data">
                  {data.wind
                    ? `${data.wind.speed.toFixed(1)} ${
                        unitSystem === "Imperial" ? "mph" : "m/s"
                      }`
                    : "N/A"}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OsunWeatherApp;
