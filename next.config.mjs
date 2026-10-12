/**
 * Where the API runs. The browser never calls it directly: it calls /api/v1/public/* on this site, and Next
 * forwards the request, so nothing needs CORS. Only the public part is forwarded: this site has no sign-in,
 * so the API's accounts and admin routes are not reachable through it. Pages read the API from the server
 * with `src/lib/api.js`.
 */
const API_ORIGIN = (process.env.API_ORIGIN || (process.env.NODE_ENV === "production" ? "" : "http://localhost:4000")).replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // A production build with no API set forwards nothing, so /api/* is a plain 404 rather than a hanging request.
    return API_ORIGIN ? [{ source: "/api/v1/public/:path*", destination: API_ORIGIN + "/v1/public/:path*" }] : [];
  },
};

export default nextConfig;
