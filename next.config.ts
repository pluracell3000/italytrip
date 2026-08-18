import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo>/ — the deploy workflow sets
// NEXT_PUBLIC_BASE_PATH=/italytrip. Local dev and root-domain hosts (e.g.
// Vercel) leave it unset.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
