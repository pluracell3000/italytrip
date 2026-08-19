import { PLAN_HORIZON_HOURS, toLocalHourKey } from "@/lib/planning";
import type { HourlyForecast, WeatherSnapshot } from "@/types/game";
import type { IconName } from "@/types/icon";

type OpenMeteoResponse = {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    weather_code?: number;
    is_day?: number;
    precipitation?: number;
  };
  hourly?: {
    time?: string[];
    temperature_2m?: number[];
    apparent_temperature?: number[];
    weather_code?: number[];
    is_day?: number[];
    precipitation?: number[];
  };
  daily?: { sunset?: string[] };
};

export function weatherLabel(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Misty";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  return "Thunderstorms";
}

export function weatherIcon(code: number, isDay = true): IconName {
  if (code === 0) return isDay ? "sun" : "cloud";
  if (code <= 3) return "cloud-sun";
  if (code >= 51) return "cloud-rain";
  return "cloud";
}

export function isWetWeather(code: number): boolean {
  return code >= 51;
}

function parseHourly(data: OpenMeteoResponse): HourlyForecast[] {
  const hourly = data.hourly;
  if (!hourly?.time) return [];
  return hourly.time.flatMap((time, index) => {
    const temperature = hourly.temperature_2m?.[index];
    const weatherCode = hourly.weather_code?.[index];
    if (typeof temperature !== "number" || typeof weatherCode !== "number") {
      return [];
    }
    return [
      {
        time,
        temperature: Math.round(temperature),
        apparentTemperature: Math.round(
          hourly.apparent_temperature?.[index] ?? temperature,
        ),
        weatherCode,
        isDay: (hourly.is_day?.[index] ?? 1) !== 0,
        precipitation: hourly.precipitation?.[index] ?? 0,
      },
    ];
  });
}

/**
 * Conditions for a future start time, taken from the hourly forecast.
 * Open-Meteo returns hours in Europe/Rome and the app treats the device
 * clock as trip-local, so entries are matched on the local wall-clock hour.
 * Returns null when the hour is outside the fetched window.
 */
export function forecastFor(
  weather: WeatherSnapshot,
  target: Date,
): WeatherSnapshot | null {
  const key = toLocalHourKey(target);
  const entry = weather.hourly?.find((hour) => hour.time === key);
  if (!entry) return null;
  return {
    temperature: entry.temperature,
    apparentTemperature: entry.apparentTemperature,
    weatherCode: entry.weatherCode,
    isDay: entry.isDay,
    precipitation: entry.precipitation,
    label: weatherLabel(entry.weatherCode),
    // Sunset is tied to the live day; derived snapshots do not carry it.
    sunset: null,
    updatedAt: weather.updatedAt,
  };
}

export async function fetchWeather(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      "temperature_2m,apparent_temperature,weather_code,is_day,precipitation",
    hourly:
      "temperature_2m,apparent_temperature,weather_code,is_day,precipitation",
    daily: "sunset",
    timezone: "Europe/Rome",
    // Enough hourly cover for plan-ahead starts up to PLAN_HORIZON_HOURS out.
    forecast_days: String(1 + Math.ceil(PLAN_HORIZON_HOURS / 24)),
  });
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
    { signal },
  );

  if (!response.ok) throw new Error("Weather service unavailable");
  const data = (await response.json()) as OpenMeteoResponse;
  const current = data.current;

  if (
    !current ||
    typeof current.temperature_2m !== "number" ||
    typeof current.weather_code !== "number"
  ) {
    throw new Error("Weather response incomplete");
  }

  return {
    temperature: Math.round(current.temperature_2m),
    apparentTemperature: Math.round(
      current.apparent_temperature ?? current.temperature_2m,
    ),
    weatherCode: current.weather_code,
    isDay: current.is_day !== 0,
    precipitation: current.precipitation ?? 0,
    label: weatherLabel(current.weather_code),
    sunset: data.daily?.sunset?.[0] ?? null,
    updatedAt: Date.now(),
    hourly: parseHourly(data),
  };
}
