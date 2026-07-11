/**
 * Public-service + eco-friendly palette.
 * Primary green carries the brand; status colors stay unambiguous
 * (green = plenty of room, yellow = filling up, red = needs pickup now).
 */
export const colors = {
  primary: "#0FA958",
  primaryDark: "#0B7C41",
  primaryLight: "#E4F7EC",

  background: "#FFFFFF",
  surface: "#F7F9F8",
  border: "#E5E8E6",

  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textInverse: "#FFFFFF",

  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",

  fillLow: "#22C55E", // 0-40%
  fillMid: "#F59E0B", // 41-75%
  fillHigh: "#EF4444", // 76-100%

  overlay: "rgba(17, 24, 39, 0.5)",
} as const;

export type FillLevel = "low" | "mid" | "high";

export function getFillColor(fillRate: number): string {
  if (fillRate >= 76) return colors.fillHigh;
  if (fillRate >= 41) return colors.fillMid;
  return colors.fillLow;
}
