/// <reference types="vite-plugin-svgr/client" />
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineSearch } from "react-icons/ai";
import {
  BsCloudFog2Fill,
  BsCloudyFill,
  BsFillCloudRainFill,
  BsFillSunFill,
} from "react-icons/bs";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { WiBarometer } from "react-icons/wi";
import { FiWind } from "react-icons/fi";
import { RiLoaderFill } from "react-icons/ri";
import { IoWaterSharp } from "react-icons/io5";
import { FiSunrise, FiSunset } from "react-icons/fi";
// import { ReactComponent as SemiCircle } from "../assets/line.svg";
import semiCircle from "../assets/line.svg";
import "./styles.scss";

interface WeatherDataProps {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  weather: {
    main: string;
  }[];
  wind: {
    speed: number;
  };
}

const DisplayWeather = () => {
  const apiKey = "7f0df34d540fea45ed3dccd5827ef962";
  const apiEndPoint = "http://api.openweathermap.org/data/2.5/weather";

  const [weather, setWeather] = useState<WeatherDataProps | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchCity, setSearchCity] = useState("");

  const fetchWeatherData = async (city: string) => {
    try {
      const url = `${apiEndPoint}?q=${city}&appid=${apiKey}&units=metric`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Error fetching weather data");
      throw error;
    }
  };

  const handleSearch = async () => {
    if (searchCity.trim() === "") {
      return;
    }

    try {
      setIsLoading(true);
      const weatherData = await fetchWeatherData(searchCity);
      setWeather(weatherData);
      setIsLoading(false);
    } catch (error) {
      console.error("No results found", error);
      setError("No results found");
      setIsLoading(false);
    }
  };

  const iconChanger = (weather: string) => {
    let iconElement: React.ReactNode;
    let iconColor: string;

    switch (weather) {
      case "Rain":
        iconElement = <BsFillCloudRainFill />;
        iconColor = "#272829";
        break;

      case "Clear":
        iconElement = <BsFillSunFill />;
        iconColor = "#ffc436";
        break;

      case "Clouds":
        iconElement = <BsCloudyFill />;
        iconColor = "#2B4A7E";
        break;

      case "Mist":
        iconElement = <BsCloudFog2Fill />;
        iconColor = "#279eff";
        break;

      default:
        iconElement = <TiWeatherPartlySunny />;
        iconColor = "#7b2869";
    }

    return (
      <span className="icon" style={{ color: iconColor }}>
        {iconElement}
      </span>
    );
  };

  useEffect(() => {
    const fetchDefaultWeather = async () => {
      try {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const url = `${apiEndPoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
            const response = await axios.get(url);
            setWeather(response.data);
            console.log(response);
            setIsLoading(false);
          },
          (error) => {
            console.error("Error getting geolocation:", error);
            setError("Error getting geolocation");
            setIsLoading(false);
          }
        );
      } catch (error) {
        console.error("Error in fetching weather:", error);
        setError("Error in fetching weather");
        setIsLoading(false);
      }
    };

    fetchDefaultWeather();
  }, []);

  const hourlyData = [
    { time: "10:00 AM", icon: "Rain", temp: "20°C" },
    { time: "11:00 AM", icon: "Clear", temp: "22°C" },
    { time: "12:00 PM", icon: "Clouds", temp: "21°C" },
    { time: "01:00 PM", icon: "Mist", temp: "19°C" },
    { time: "02:00 PM", icon: "Cloudy", temp: "18°C" },
  ];

  const HourlyForecast = () => {
    return (
      <div className="hourlyForecast">
        {hourlyData.map((hour, index) => (
          <div className="hourlyItem" key={index}>
            <p className="hourlyTime">{hour.time}</p>
            <div className="hourlyIcon">{hour.icon}</div>
            <p className="hourlyTemp">{hour.temp}</p>
          </div>
        ))}
      </div>
    );
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutesStr} ${ampm}`;
  };
  return (
    <div className="main-wrapper">
      <div className="ellipseOne"></div>
      <div className="ellipseTwo"></div>
      <div className="ellipseThree"></div>
      <div className="container">
        <div className="search-area">
          <input
            type="text"
            placeholder="Enter a city"
            onChange={(e) => setSearchCity(e.target.value)}
            className="search-input"
          />
          <div className="search-circle" onClick={handleSearch}>
            <AiOutlineSearch />
          </div>
        </div>

        {!isLoading && weather ? (
          <>
            <div className="weather-area">
              <h1>{weather.name}</h1>
              <span>{weather.sys.country}</span>
              <div className="icon">{iconChanger(weather.weather[0].main)}</div>
              <h1>{weather.main.temp}°C</h1>
              <h2>{weather.weather[0].main}</h2>
            </div>

            <HourlyForecast />

            <div className="about-sun">
              <div className="sun-rise">
                <FiSunrise className="sun-icon" />
                <div className="sunrise-time">
                  {formatTime(weather.sys.sunrise)}
                </div>
              </div>
              <div className="semi-circle">
                <img src={semiCircle} alt="line" />
              </div>
              <div className="sun-set">
                <FiSunset className="sun-icon" />
                <div className="sunset-time">
                  {formatTime(weather.sys.sunset)}
                </div>
              </div>
            </div>

            <div className="bottom-info-area">
              <div className="humidity">
                {/* <WiHumidity /> */}
                <IoWaterSharp className="humidIcon" />
                <div className="humidInfo">
                  <h2>{weather.main.humidity}%</h2>
                  <p>Humidity</p>
                </div>
              </div>

              <div className="wind">
                <FiWind className="windIcon" />
                <div className="windInfo">
                  <h2>{weather.wind.speed} km/h</h2>
                  <p>Wind</p>
                </div>
              </div>

              <div className="pressure">
                <WiBarometer className="pressureIcon" />
                <div className="pressureInfo">
                  <h2>{weather.main.pressure} hPa</h2>
                  <p>Pressure</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>
            {isLoading ? <RiLoaderFill /> : <h2>No Weather Data Found</h2>}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayWeather;
