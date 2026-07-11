import { CameraView } from "expo-camera";
import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@theme/index";

interface QRScannerFrameProps {
  onScanned: (data: string) => void;
  active: boolean;
  hint?: string;
}

/** Full-screen camera view per the style guide — QR scan should feel instant. */
export function QRScannerFrame({ onScanned, active, hint }: QRScannerFrameProps) {
  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={active ? (result) => onScanned(result.data) : undefined}
      />
      <View style={styles.overlay}>
        <View style={styles.frame} />
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
    </View>
  );
}

const FRAME_SIZE = 260;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  hint: { ...typography.bodyBold, color: colors.textInverse },
});
