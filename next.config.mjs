/**
 * Where the API runs. The browser never calls it directly: it calls /api/* on this site, and Next forwards
 * the request, so nothing needs CORS. Pages read it from the server with `src/lib/api.js`.
 */
const API_ORIGIN = (process.env.API_ORIGIN || (process.env.NODE_ENV === "production" ? "" : "http://localhost:4000")).replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // A production build with no API set forwards nothing, so /api/* is a plain 404 rather than a hanging request.
    return API_ORIGIN ? [{ source: "/api/:path*", destination: API_ORIGIN + "/:path*" }] : [];
  },
};

export default nextConfig;
