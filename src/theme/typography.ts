import { TextStyle } from "react-native";

/** Short, bold copy per the style guide — keep line counts low on CTAs. */
export const typography: Record<string, TextStyle> = {
  h1: { fontSize: 28, fontWeight: "800", lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: "700", lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: "700", lineHeight: 24 },
  body: { fontSize: 15, fontWeight: "400", lineHeight: 21 },
  bodyBold: { fontSize: 15, fontWeight: "700", lineHeight: 21 },
  caption: { fontSize: 13, fontWeight: "400", lineHeight: 18 },
  button: { fontSize: 16, fontWeight: "700", lineHeight: 20 },
};
