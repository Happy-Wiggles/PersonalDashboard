import { MOCK_WEATHER_DATA } from "./weatherMock";

interface CurrentPosition {
  longitude: number;
  latitude: number;
}

class WeatherService {
  private Position: CurrentPosition;
  private TimeZone: string;

  constructor() {
    this.Position = { longitude: 0, latitude: 0 };
    this.TimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  public fetchWeather = async () => {
    try {
      this.Position = await this.getCoordinates();

      const params = new URLSearchParams({
        latitude: this.Position.latitude.toString(),
        longitude: this.Position.longitude.toString(),
        current_weather: "true",
        daily:
          "weathercode,temperature_2m_max,temperature_2m_min,windspeed_10m_max,sunrise,sunset,uv_index_max,precipitation_probability_max",
        timezone: this.TimeZone,
      });

      const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

      const response = await fetch(url);

      if (!response.ok)
        throw new Error(
          "Weather data could not be loaded from the source (open-meteo.com)!",
        );

      const data = await response.json();
      return { data, isMock: false };
    } catch (error) {
      console.error("Weather API Error, using mock data:", error);

      return {
        data: {
          ...MOCK_WEATHER_DATA,
          latitude: this.Position.latitude,
          longitude: this.Position.longitude,
        },
        isMock: true,
      };
    }
  };

  public getWeatherIcon = (code: number) => {
    // 0: Clear skies
    if (code === 0) return "☀️";

    // 1: Mostly clear (with some clouds)
    if (code === 1) return "🌤️";

    // 2: Partly Cloudy
    if (code === 2) return "⛅";

    // 3: Covered (gray sky)
    if (code === 3) return "☁️";

    // 45, 48: Fog
    if (code >= 45 && code <= 48) return "🌫️";

    // 51 - 67: Rainy
    if (code >= 51 && code <= 67) return "🌧️";

    // 71 - 77: Snow
    if (code >= 71 && code <= 77) return "❄️";

    // 80 - 82: Rainy + sunny
    if (code >= 80 && code <= 82) return "🌦️";

    // 95 - 99: Thunderstorm
    if (code >= 95) return "⛈️";

    return "❓";
  };

  public getWeatherIconUrl = (code: number) => {
    // 0: Clear skies
    if (code === 0) return "https://img.icons8.com/fluency/48/sun.png";

    // 1, 2: Mostly clear (with some clouds)
    if (code === 1 || code === 2)
      return "https://img.icons8.com/fluency/48/partly-cloudy-day.png";

    // 3: Covered (gray sky)
    if (code === 3) return "https://img.icons8.com/fluency/48/cloud.png";

    // 45, 48: Fog
    if (code >= 45 && code <= 48)
      return "https://img.icons8.com/fluency/48/fog-day.png";

    // 51 - 67: Rainy
    if (code >= 51 && code <= 67)
      return "https://img.icons8.com/fluency/48/rain.png";

    // 71 - 77: Snowy
    if (code >= 71 && code <= 77)
      return "https://img.icons8.com/fluency/48/snow.png";

    // 80, 81, 82: Sunny and Rainy
    if (code >= 80 && code <= 82)
      return "https://img.icons8.com/?size=100&id=19541&format=png&color=000000";

    // 95 - 99: Thunderstorm
    if (code >= 95) return "https://img.icons8.com/fluency/48/storm.png";

    // Fallback
    return "https://img.icons8.com/fluency/48/moderate-rain.png";
  };

  private async getIpLocation(): Promise<CurrentPosition> {
    const response = await fetch("http://ip-api.com/json/");
    const data = await response.json();
    return {
      latitude: data.lat,
      longitude: data.lon,
    };
  }

  private getCoordinates = async (): Promise<CurrentPosition> => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        async () => {
          console.warn("GPS abgelehnt, nutze IP-Location...");
          try {
            const ipLoc = await this.getIpLocation();
            resolve(ipLoc);
          } catch {
            // Last resort: Just take Berlin...
            resolve({ latitude: 52.52, longitude: 13.41 });
          }
        },
        { timeout: 3000 },
      );
    });
  };
}

export default WeatherService;
