import { ICON_PATHS } from "@/lib/iconPaths";
import { cn } from "@/lib/utils";
import type { IconName } from "@/types/icon";

type IconProps = {
  name: IconName;
  className?: string;
  strokeWidth?: number;
  label?: string;
};

export default function Icon({
  name,
  className,
  strokeWidth = 1.8,
  label,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-5 shrink-0", className)}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] }}
    />
  );
}

export function createIconSvgElement(name: IconName): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.8");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = ICON_PATHS[name];
  return svg;
}
