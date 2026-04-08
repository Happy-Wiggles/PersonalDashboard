// src/services/weatherMock.ts
export const MOCK_WEATHER_DATA = {
  latitude: 52.52,
  longitude: 13.41,
  generationtime_ms: 0.1,
  utc_offset_seconds: 3600,
  timezone: "Europe/Berlin",
  timezone_abbreviation: "CET",
  elevation: 38.0,
  current_weather: {
    temperature: 12.5,
    windspeed: 15.7,
    winddirection: 120,
    weathercode: 3, // Cloudy
    time: new Date().toISOString(),
  },
  daily: {
    time: [
      "2026-04-07",
      "2026-04-08",
      "2026-04-09",
      "2026-04-10",
      "2026-04-11",
      "2026-04-12",
      "2026-04-13",
    ],
    weathercode: [3, 51, 0, 1, 3, 45, 95],
    temperature_2m_max: [14, 12, 18, 19, 15, 11, 13],
    temperature_2m_min: [8, 7, 10, 11, 9, 6, 8],
    windspeed_10m_max: [20, 25, 15, 12, 18, 10, 30],
    sunrise: ["06:30", "06:28", "06:26", "06:24", "06:22", "06:20", "06:18"],
    sunset: ["20:01", "20:03", "20:05", "20:07", "20:09", "20:11", "20:13"],
    uv_index_max: [3, 2, 5, 6, 3, 2, 1],
    precipitation_probability_max: [10, 80, 0, 5, 20, 15, 90],
  },
};
