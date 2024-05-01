export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/",
    "/endpoint/:path*",
    "/graph/:path*",
    "/api/dashboards/:path*",
    "/api/endpoints/:path*",
    "/api/graphs/:path*",
    "/api/layout/:path*",
    "/api/users/:path*",
    "/api/workWithEndpoint/:path*"
  ]
};
