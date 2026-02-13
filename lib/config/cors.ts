export const corsConfig = {
  allowOrigin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
} as const;

export function buildCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": corsConfig.allowOrigin,
    "Access-Control-Allow-Methods": corsConfig.allowMethods.join(", "),
    "Access-Control-Allow-Headers": corsConfig.allowHeaders.join(", "),
  };
}
