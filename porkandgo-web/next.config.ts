import type { NextConfig } from "next";
import path from "node:path";

// EXPORT=1 builds a static copy (out/) used for the shareable preview link.
const exporting = process.env.EXPORT === "1";

const nextConfig: NextConfig = {
  // lets you open the dev server from your LAN address (e.g. a phone on the same Wi-Fi)
  allowedDevOrigins: ["172.23.48.1"],
  cacheComponents: !exporting,
  partialPrefetching: !exporting,
  ...(exporting ? { output: "export" as const, trailingSlash: true, images: { unoptimized: true } } : {}),
  turbopack: {
    // pin the project root so a stray package-lock.json in a parent folder is ignored
    root: path.resolve(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
