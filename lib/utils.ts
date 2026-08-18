import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats an energy/hunger delta as a signed label, e.g. "+18" / "-12". */
export function formatDelta(delta: number): string {
  return delta > 0 ? `+${delta}` : `${delta}`;
}

/** Clamps a stat to the 0–100 game range. */
export function clampStat(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}
