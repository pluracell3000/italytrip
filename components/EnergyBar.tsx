"use client";

import { cn } from "@/lib/utils";

type EnergyBarProps = {
  value: number;
  className?: string;
};

function barColor(value: number): string {
  if (value <= 25) return "bg-terracotta";
  if (value <= 50) return "bg-gold";
  return "bg-olive";
}

export default function EnergyBar({ value, className }: EnergyBarProps) {
  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-ink/10",
        className,
      )}
      role="meter"
      aria-label="Energy"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-700 ease-out",
          barColor(value),
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
