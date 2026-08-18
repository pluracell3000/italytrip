import type { StyleSpecification } from "maplibre-gl";

// Custom "game world" map style for Mocale Quest.
//
// Built from scratch on OpenFreeMap vector tiles (OpenMapTiles schema) so the
// prototype needs no API token. The layer set is deliberately tiny:
// terrain-ish landcover, forests, water, subdued roads and a handful of place
// labels — no commercial POIs, no default-basemap noise.
//
// Swapping to Mapbox later = replace this style + map constructor; the rest
// of the app only knows about markers and coordinates.

const palette = {
  parchment: "#F1E5CF",
  parchmentDeep: "#E9D9BC",
  forest: "#A9BE8C",
  grass: "#CFD9A8",
  park: "#BCCB96",
  settlement: "#E6D4B2",
  water: "#8FC0CB",
  waterDeep: "#7AB2BF",
  roadMinor: "#DFCBA4",
  roadMajor: "#D3B183",
  roadHighway: "#C89F6E",
  boundary: "#C2A98A",
  label: "#6C563C",
  labelHalo: "#F4EAD7",
};

export const MAP_STYLE: StyleSpecification = {
  version: 8,
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  sources: {
    openmaptiles: {
      type: "vector",
      url: "https://tiles.openfreemap.org/planet",
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: { "background-color": palette.parchment },
    },
    {
      id: "landuse-settlement",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landuse",
      filter: [
        "in",
        ["get", "class"],
        ["literal", ["residential", "suburb", "neighbourhood"]],
      ],
      paint: { "fill-color": palette.settlement, "fill-opacity": 0.55 },
    },
    {
      id: "landcover-grass",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landcover",
      filter: [
        "in",
        ["get", "class"],
        ["literal", ["grass", "farmland", "meadow"]],
      ],
      paint: { "fill-color": palette.grass, "fill-opacity": 0.35 },
    },
    {
      id: "park",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "park",
      paint: { "fill-color": palette.park, "fill-opacity": 0.35 },
    },
    {
      id: "landcover-wood",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landcover",
      filter: ["==", ["get", "class"], "wood"],
      paint: {
        "fill-color": palette.forest,
        "fill-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8,
          0.55,
          14,
          0.75,
        ],
      },
    },
    {
      id: "waterway",
      type: "line",
      source: "openmaptiles",
      "source-layer": "waterway",
      filter: ["in", ["get", "class"], ["literal", ["river", "canal", "stream"]]],
      paint: {
        "line-color": palette.waterDeep,
        "line-width": [
          "interpolate",
          ["exponential", 1.4],
          ["zoom"],
          8,
          0.6,
          14,
          3,
        ],
        "line-opacity": 0.8,
      },
    },
    {
      id: "water",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "water",
      filter: ["!=", ["get", "brunnel"], "tunnel"],
      paint: { "fill-color": palette.water },
    },
    {
      id: "road-minor",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      minzoom: 11,
      filter: [
        "in",
        ["get", "class"],
        ["literal", ["tertiary", "minor", "service"]],
      ],
      paint: {
        "line-color": palette.roadMinor,
        "line-width": [
          "interpolate",
          ["exponential", 1.4],
          ["zoom"],
          11,
          0.5,
          15,
          2.5,
        ],
      },
    },
    {
      id: "road-major",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      filter: ["in", ["get", "class"], ["literal", ["primary", "secondary"]]],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": palette.roadMajor,
        "line-width": [
          "interpolate",
          ["exponential", 1.4],
          ["zoom"],
          8,
          0.7,
          15,
          4,
        ],
      },
    },
    {
      id: "road-highway",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      filter: ["in", ["get", "class"], ["literal", ["motorway", "trunk"]]],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: {
        "line-color": palette.roadHighway,
        "line-width": [
          "interpolate",
          ["exponential", 1.4],
          ["zoom"],
          8,
          1.2,
          15,
          6,
        ],
        "line-opacity": 0.9,
      },
    },
    {
      id: "boundary-region",
      type: "line",
      source: "openmaptiles",
      "source-layer": "boundary",
      filter: [
        "all",
        ["==", ["get", "admin_level"], 4],
        ["!=", ["get", "maritime"], 1],
      ],
      paint: {
        "line-color": palette.boundary,
        "line-width": 1,
        "line-dasharray": [3, 3],
        "line-opacity": 0.5,
      },
    },
    {
      id: "place-labels",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      filter: ["in", ["get", "class"], ["literal", ["city", "town", "village"]]],
      layout: {
        "text-field": ["coalesce", ["get", "name:latin"], ["get", "name"]],
        "text-font": ["Noto Sans Regular"],
        "text-size": [
          "match",
          ["get", "class"],
          "city",
          14,
          "town",
          12.5,
          11,
        ],
        "text-letter-spacing": 0.08,
        "text-transform": "uppercase",
        "symbol-sort-key": ["coalesce", ["get", "rank"], 10],
      },
      paint: {
        "text-color": palette.label,
        "text-halo-color": palette.labelHalo,
        "text-halo-width": 1.4,
        "text-opacity": 0.9,
      },
    },
  ],
};
