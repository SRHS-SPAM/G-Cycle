import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCameraPermissions } from "expo-camera";
import { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@components/buttons";
import { QRScannerFrame } from "@components/qr";
import { colors, spacing, typography } from "@theme/index";

import type { ScanStackParamList } from "@app/navigation/types";

type Props = NativeStackScreenProps<ScanStackParamList, "QRScan">;

/**
 * One QR code, three outcomes: enter a store, start an order, or confirm a
 * return — the payload prefix decides which. Kept full-screen camera per the
 * style guide.
 */
export default function QRScanScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const scannedRef = useRef(false);

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <View style={styles.permission}>
        <Text style={styles.permissionText}>QR 스캔을 위해 카메라 접근이 필요해요.</Text>
        <PrimaryButton label="카메라 권한 허용" onPress={requestPermission} fullWidth={false} />
      </View>
    );
  }

  const handleScanned = (data: string) => {
    if (scannedRef.current) return;
    scannedRef.current = true;

    // Expected payload: "gcycle://store/{storeId}/container/{containerCode}"
    const match = data.match(/store\/([^/]+)(?:\/container\/([^/]+))?/);
    const storeId = match?.[1] ?? "unknown-store";
    const containerCode = match?.[2];

    navigation.replace("OrderCreate", { storeId, containerCode });
  };

  return <QRScannerFrame active onScanned={handleScanned} hint="매장 QR을 프레임 안에 맞춰주세요" />;
}

const styles = StyleSheet.create({
  permission: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  permissionText: { ...typography.body, color: colors.textSecondary, textAlign: "center" },
});
