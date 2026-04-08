import { useEffect, useState } from "react";
import WeatherService from "../services/WeatherApiService";

interface OpenMeteoResponse {
  timezone: string;
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    windspeed_10m_max: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    precipitation_probability_max: number[];
  };
}

interface WeatherDataCollection {
  label: string;
  degrees: string;
  windspeed: string;
}

const weatherService = new WeatherService();

const Weather = () => {
  const [weatherData, setWeatherData] = useState<OpenMeteoResponse | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [isMock, setIsMock] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedWeather, setSelectedWeather] = useState<WeatherDataCollection>(
    {
      label: "Aktuell",
      degrees: "0",
      windspeed: "0",
    },
  );

  useEffect(() => {
    const initWeatherData = async () => {
      try {
        setLoading(true);
        const result = await weatherService.fetchWeather();

        if (result && result.data) {
          setWeatherData(result.data);
          setIsMock(result.isMock);

          setSelectedWeather({
            degrees: `${result.data.current_weather.temperature}°C`,
            windspeed: `${result.data.current_weather.windspeed} km/h`,
            label: "Aktuell",
          });
          console.log("Weather has been loaded successfully!");
        } else {
          throw new Error("Result from the api service had an error");
        }
      } catch (error) {
        console.error("Weather could not be loaded...", error);
      } finally {
        setLoading(false);
      }
    };

    initWeatherData();
  }, []);

  const handleOnDayClick = (index: number) => {
    if (!weatherData) return;

    setActiveIndex(index);

    if (index === 0) {
      setSelectedWeather({
        degrees: `${weatherData.current_weather.temperature}°C`,
        windspeed: `${weatherData.current_weather.windspeed} km/h`,
        label: "Aktuell",
      });
    } else {
      // Vorhersage-Daten für die anderen Tage
      setSelectedWeather({
        degrees: `${Math.round(weatherData.daily.temperature_2m_max[index])}°C`,
        // Hier nutzen wir den neuen Parameter aus der daily-Liste
        windspeed: `${weatherData.daily.windspeed_10m_max[index]} km/h`,
        label: new Date(weatherData.daily.time[index]).toLocaleDateString(
          "de-DE",
          { weekday: "long" },
        ),
      });
    }
  };

  return (
    <div>
      <div className="rounded-2xl shadow-inner">
        {/* If the weather api could not be reached mockdata is being used and this warning will be shown */}
        {isMock && (
          <div className="bg-amber-500/10 border border-amber-500/50 p-3 rounded-lg mb-4 flex items-center gap-3">
            <span className="text-amber-500 text-xl">⚠️</span>
            <div>
              <p className="text-amber-500 text-xs font-bold uppercase">
                Offline-Modus / Demo-Daten
              </p>
              <p className="text-gray-400 text-xs">
                Die Wetter-API ist aktuell nicht erreichbar. Es werden
                Beispieldaten angezeigt.
              </p>
            </div>
          </div>
        )}

        <h3 className="text-cyan-400 font-bold mb-2">
          Wettervorhersagen für "{weatherData?.timezone || "Niemandsland"}"
        </h3>

        {loading ? (
          <p className="text-gray-400 italic">Suche Satelliten...</p>
        ) : weatherData ? (
          <div className="text-white">
            {/* Label based on selected day */}
            <p className="text-sm text-cyan-400 font-semibold uppercase tracking-wider mb-1">
              {selectedWeather?.label || "Aktuell"}
            </p>
            {/* Degrees */}
            <p className="text-4xl font-bold">{selectedWeather?.degrees}</p>
            {/* Windspeed */}
            <p className="text-sm text-gray-400 mt-1">
              Windgeschwindigkeit:{" "}
              <span className="text-gray-200">
                {selectedWeather?.windspeed ||
                  `${weatherData.current_weather.windspeed} km/h`}
              </span>
            </p>
            <div
              id="specificInfos"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700/50"
            >
              {/* Rain possibility */}
              <div className="flex flex-col">
                {/* <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                    Regenrisiko
                  </span> */}
                <img
                  src="https://img.icons8.com/?size=100&id=15360&format=png&color=000000"
                  alt="Regenwahrscheinlichkeit"
                  title="Regenwahrscheinlichkeit"
                  className="w-12 h-12 md:w-20 md:h-20 object-contain select-none transition-transform duration-300 hover:scale-120 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
                  loading="lazy"
                ></img>
                <span className="text-white text-lg font-medium pl-2.5">
                  {weatherData.daily.precipitation_probability_max[activeIndex]}
                  %
                </span>
              </div>

              {/* UV-Index */}
              <div className="flex flex-col">
                <img
                  src="https://img.icons8.com/?size=100&id=tsTwjNsafMGS&format=png&color=000000"
                  alt="UV-Index"
                  title="UV-Index"
                  className="w-12 h-12 md:w-20 md:h-20 object-contain select-none transition-transform duration-300 hover:scale-120 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
                  loading="lazy"
                ></img>
                {/* <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                    UV-Index
                  </span> */}
                <span className="text-white text-lg font-medium">
                  {weatherData.daily.uv_index_max[activeIndex]}
                  <span className="text-xs text-gray-400 ml-1">
                    (
                    {weatherData.daily.uv_index_max[activeIndex] > 5
                      ? "Hoch"
                      : "OK"}
                    )
                  </span>
                </span>
              </div>

              {/* Sunrise */}
              <div className="flex flex-col">
                <img
                  src="https://img.icons8.com/?size=100&id=s51JxxE1J6OO&format=png&color=000000"
                  alt="Sonnenaufgang"
                  title="Sonnenaufgang"
                  className="w-12 h-12 md:w-20 md:h-20 object-contain select-none transition-transform duration-300 hover:scale-120 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
                  loading="lazy"
                ></img>
                {/* <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                    Sonnen-Aufgang
                  </span> */}
                <span className="text-white text-lg font-medium ml-2">
                  {new Date(
                    weatherData.daily.sunrise[activeIndex],
                  ).toLocaleTimeString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Sunset */}
              <div className="flex flex-col">
                <img
                  src="https://img.icons8.com/?size=100&id=L5pcGEmaO18S&format=png&color=000000"
                  alt="Sonnenuntergang"
                  title="Sonnenuntergang"
                  className="w-12 h-12 md:w-20 md:h-20 object-contain select-none transition-transform duration-300 hover:scale-120 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
                  loading="lazy"
                ></img>
                {/* <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                    Sonnen-Untergang
                  </span> */}
                <span className="text-white text-lg font-medium ml-2">
                  {new Date(
                    weatherData.daily.sunset[activeIndex],
                  ).toLocaleTimeString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-red-400">Wetterdaten nicht verfügbar.</p>
        )}
        {weatherData && (
          <div className="mt-8">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4 px-2">
              7-Tage-Vorhersage
            </h3>

            {/* Grid: 2 Cols on Mobile, 4 on Tablet, 7 on Desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weatherData.daily.time.map((date: string, index: number) => {
                const code = weatherData.daily.weathercode[index];
                const isToday = index === 0;
                const isActive = index === activeIndex;

                return (
                  <div
                    key={date}
                    onClick={() => handleOnDayClick(index)}
                    className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 cursor-pointer
                      ${
                        isActive
                          ? "bg-cyan-900/40 border border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)] scale-105 z-10"
                          : "bg-gray-800/50 border border-gray-700 hover:border-gray-500"
                      }`}
                  >
                    {/* Weekdays overview */}
                    <p
                      className={`text-xs font-bold ${isActive ? "text-cyan-400" : "text-gray-400"}`}
                    >
                      {isToday
                        ? "HEUTE"
                        : new Date(date).toLocaleDateString("de-DE", {
                            weekday: "short",
                          })}
                    </p>
                    <div className="flex flex-row items-center">
                      {/* Weather images */}
                      <img
                        src={weatherService.getWeatherIconUrl(code)}
                        alt="Wetterzustand"
                        className="w-12 h-12 md:w-14 md:h-14 object-contain select-none transition-transform duration-300 hover:scale-110 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
                        loading="lazy"
                      />
                      {/* Weather Icon with OS-independent styling */}
                      {/* <span
                          className="text-4xl my-3 filter drop-shadow-md select-none transform hover:scale-120 transition-transform"
                          title={`WMO Code: ${code}`}
                        >
                          {weatherService.getWeatherIcon(code)}
                        </span> */}

                      {/* Temperatures */}
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-white">
                          {Math.round(
                            weatherData.daily.temperature_2m_max[index],
                          )}
                          °C
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {Math.round(
                            weatherData.daily.temperature_2m_min[index],
                          )}
                          °C
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
