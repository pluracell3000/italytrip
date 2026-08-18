import type { LatLng } from "@/types/game";

/**
 * Generates a gently curved arc between two points, used for the quest route
 * line. A quadratic bezier with a perpendicular-offset midpoint makes the
 * route read as a playful "trail" rather than a navigation polyline.
 * Returns GeoJSON-ordered coordinates: [lng, lat][].
 */
export function arcCoordinates(
  from: LatLng,
  to: LatLng,
  segments = 48,
  curvature = 0.18,
): [number, number][] {
  const x1 = from.longitude;
  const y1 = from.latitude;
  const x2 = to.longitude;
  const y2 = to.latitude;

  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  // Perpendicular offset of the control point, scaled by segment length.
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx = mx - dy * curvature;
  const cy = my + dx * curvature;

  const coords: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const oneMinusT = 1 - t;
    const lng =
      oneMinusT * oneMinusT * x1 + 2 * oneMinusT * t * cx + t * t * x2;
    const lat =
      oneMinusT * oneMinusT * y1 + 2 * oneMinusT * t * cy + t * t * y2;
    coords.push([lng, lat]);
  }
  return coords;
}
