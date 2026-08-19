import type { WeatherSnapshot } from "@/types/game";
import type { IconName } from "@/types/icon";

type OpenMeteoResponse = {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    weather_code?: number;
    is_day?: number;
    precipitation?: number;
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
    daily: "sunset",
    timezone: "Europe/Rome",
    forecast_days: "1",
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
  };
}
