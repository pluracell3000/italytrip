import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return {
    name: "Mocale Quest",
    short_name: "Mocale",
    description:
      "A live field guide for discovering the best of Tuscany around Borgo Mocale.",
    start_url: `${basePath}/`,
    display: "standalone",
    orientation: "portrait",
    background_color: "#F1E5CF",
    theme_color: "#B14A27",
    categories: ["travel", "lifestyle"],
    icons: [
      {
        src: `${basePath}/icon.svg`,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
