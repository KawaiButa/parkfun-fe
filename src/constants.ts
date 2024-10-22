export const constants = {
  PROJECT_NAME: "PARKFUN",
  BACKEND_HOSTNAME: process.env.NEXT_PUBLIC_BACKEND_HOSTNAME ?? "",
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID  ?? "",
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "",
  AZURE_MAP_KEY: process.env.NEXT_PUBLIC_AZURE_MAP_KEY ?? "",
  STRIPE_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY ?? "",
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ?? "",
  DEFAULT_ZOOM_LEVEL: 12,
  SENTRY_DNS: process.env.SENTRY_DNS ?? "",
  NODE_ENV: process.env.NODE_ENV ?? "",
};
