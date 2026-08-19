"use client";

import { useEffect, useState } from "react";
import { BASE_LOCATION } from "@/data/quests";
import { fetchWeather } from "@/lib/weather";
import type { WeatherSnapshot } from "@/types/game";

export default function useWeather() {
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [status, setStatus] = useState<"loading" | "live" | "unavailable">(
    "loading",
  );

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    const timeout = window.setTimeout(() => controller.abort(), 7000);

    fetchWeather(
      BASE_LOCATION.latitude,
      BASE_LOCATION.longitude,
      controller.signal,
    )
      .then((snapshot) => {
        if (!mounted) return;
        setWeather(snapshot);
        setStatus("live");
      })
      .catch(() => {
        if (mounted) setStatus("unavailable");
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      mounted = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return { weather, status };
}
