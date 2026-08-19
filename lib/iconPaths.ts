import type { IconName } from "@/types/icon";

// Small, dependency-free Lucide-style icon set. The strings are constants that
// are used by both React UI and MapLibre's plain DOM markers.
export const ICON_PATHS: Record<IconName, string> = {
  check: '<path d="m5 12 4 4L19 6"/>',
  "chevron-right": '<path d="m9 18 6-6-6-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  cloud: '<path d="M17.5 19H6a4 4 0 0 1-.6-7.95A6.5 6.5 0 0 1 18 9.5a4.75 4.75 0 0 1-.5 9.5Z"/>',
  "cloud-rain": '<path d="M17.5 17H6a4 4 0 0 1-.6-7.95A6.5 6.5 0 0 1 18 7.5a4.75 4.75 0 0 1-.5 9.5Z"/><path d="m8 20-1 2m5-2-1 2m5-2-1 2"/>',
  "cloud-sun": '<path d="M12 3V1m5.7 4.3 1.4-1.4M6.3 5.3 4.9 3.9M19 10h2"/><path d="M17.5 20H7a4 4 0 0 1-.4-8A5.5 5.5 0 0 1 17 10.5a4.75 4.75 0 0 1 .5 9.5Z"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z"/>',
  droplet: '<path d="M12 2.5S6.5 9 6.5 14a5.5 5.5 0 0 0 11 0c0-5-5.5-11.5-5.5-11.5Z"/>',
  flag: '<path d="M5 21V4m0 1h11l-2 3 2 3H5"/>',
  home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/>',
  landmark: '<path d="m3 10 9-6 9 6H3Zm2 3h14M6 10v3m4-3v3m4-3v3m4-3v3M4 17h16M3 21h18"/>',
  leaf: '<path d="M20 4c-8 0-14 4-14 10 0 3 2 5 5 5 6 0 9-7 9-15Z"/><path d="M4 21c2-6 6-10 12-13"/>',
  locate: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/><circle cx="12" cy="12" r="7"/>',
  map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15m6-12v15"/>',
  navigation: '<path d="m4 4 16 6-7 3-3 7-6-16Z"/>',
  pizza: '<path d="M12 3a10 10 0 0 1 9 6L7 21 3 7a10 10 0 0 1 9-4Z"/><path d="M3 7c5-2 13-1 18 2"/><circle cx="11" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="15" r="1" fill="currentColor" stroke="none"/>',
  route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h2a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  sparkles: '<path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z"/><path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14ZM5 13l.8 2.2L8 16l-2.2.8L5 19l-.8-2.2L2 16l2.2-.8L5 13Z"/>',
  sprout: '<path d="M12 21v-9m0 2c0-4 3-7 8-7 0 5-3 8-8 8m0-3c0-4-3-6-8-6 0 5 3 7 8 7"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M19 5l-1.5 1.5m-11 11L5 19"/>',
  sunset: '<path d="M3 18h18M5 22h14M7 18a5 5 0 0 1 10 0M12 3v4M4.2 10.2l2.1 1.2m11.4 0 2.1-1.2M7 5l1.4 2M17 5l-1.4 2"/>',
  tree: '<path d="m12 3-5 7h3l-5 7h14l-5-7h3l-5-7Z"/><path d="M12 17v4"/>',
  umbrella: '<path d="M3 12a9 9 0 0 1 18 0H3Zm9 0v7a2 2 0 0 0 4 0"/>',
  utensils: '<path d="M7 3v7m-3-7v4a3 3 0 0 0 6 0V3M7 10v11M17 3v18m0-18c-3 2-4 6-4 9h4"/>',
  waves: '<path d="M2 7c2 0 2-1.5 4-1.5S8 7 10 7s2-1.5 4-1.5S16 7 18 7s2-1.5 4-1.5M2 12c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M2 17c2 0 2-1.5 4-1.5S8 17 10 17s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
};
