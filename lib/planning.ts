import type { RunState } from "@/types/game";

// The "plan ahead" lens: pick a start time in the future — a preset or a
// custom moment — and rank quests for that hour instead of right now.
//
// The whole app treats the device clock as trip-local time (the HUD clock and
// the scoring hour both read it), so every helper here works in local
// wall-clock terms as well.

/** How far ahead a plan can start; the hourly forecast fetch covers this. */
export const PLAN_HORIZON_HOURS = 48;

/** Baseline stats for a fresh day — also the initial run in GameScreen. */
export const FRESH_DAY_STATS = { energy: 88, hunger: 35 } as const;

export type PlanPreset = {
  id: "this-evening" | "tomorrow-morning" | "tomorrow-afternoon";
  label: string;
  /** Short time hint rendered next to the label, e.g. "18:00". */
  hint: string;
  at: Date;
};

export function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function moment(base: Date, dayOffset: number, hours: number): Date {
  const date = new Date(base);
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hours, 0, 0, 0);
  return date;
}

/**
 * Presets offered in the What-next sheet. "This evening" drops out once the
 * evening has effectively arrived; tomorrow's presets are always available.
 */
export function getPlanPresets(now = new Date()): PlanPreset[] {
  const presets: PlanPreset[] = [];
  if (now.getHours() < 17) {
    presets.push({
      id: "this-evening",
      label: "This evening",
      hint: "18:00",
      at: moment(now, 0, 18),
    });
  }
  presets.push(
    {
      id: "tomorrow-morning",
      label: "Tomorrow morning",
      hint: "09:00",
      at: moment(now, 1, 9),
    },
    {
      id: "tomorrow-afternoon",
      label: "Tomorrow afternoon",
      hint: "15:00",
      at: moment(now, 1, 15),
    },
  );
  return presets;
}

const pad = (value: number) => String(value).padStart(2, "0");

/** Local "YYYY-MM-DDTHH:mm" for <input type="datetime-local"> values. */
export function toDateTimeLocal(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Local "YYYY-MM-DDTHH:00" — the shape of Open-Meteo's hourly timestamps. */
export function toLocalHourKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:00`;
}

/** Parses a datetime-local value; returns null while the field is incomplete. */
export function parseDateTimeLocal(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Keeps a custom start time between "now" and the plan horizon. */
export function clampPlanTime(date: Date, now = new Date()): Date {
  const min = now.getTime();
  const max = min + PLAN_HORIZON_HOURS * 3_600_000;
  return new Date(Math.min(Math.max(date.getTime(), min), max));
}

function partOfDay(hour: number): string {
  if (hour < 5 || hour >= 22) return "night";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

/** "this evening", "tomorrow morning", "Friday afternoon" — for headlines. */
export function describePlanMoment(target: Date, now = new Date()): string {
  const part = partOfDay(target.getHours());
  if (isSameLocalDay(target, now)) {
    return part === "night" ? "tonight" : `this ${part}`;
  }
  if (isSameLocalDay(target, moment(now, 1, 12))) {
    return part === "night" ? "tomorrow night" : `tomorrow ${part}`;
  }
  const weekday = target.toLocaleDateString("en-GB", { weekday: "long" });
  return `${weekday} ${part}`;
}

/** "today at 18:00", "tomorrow at 09:00", "Fri 21 Aug at 10:00". */
export function formatPlanTime(target: Date, now = new Date()): string {
  const time = target.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (isSameLocalDay(target, now)) return `today at ${time}`;
  if (isSameLocalDay(target, moment(now, 1, 12))) return `tomorrow at ${time}`;
  const day = target.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return `${day} at ${time}`;
}

/**
 * Stats to rank a different day with: assume a night's rest at the borgo
 * instead of dragging tonight's tiredness into tomorrow morning's plan.
 * Completed quests and the active quest carry over untouched.
 */
export function runForPlanTime(
  run: RunState,
  target: Date,
  now = new Date(),
): RunState {
  if (isSameLocalDay(target, now)) return run;
  return { ...run, ...FRESH_DAY_STATS };
}
