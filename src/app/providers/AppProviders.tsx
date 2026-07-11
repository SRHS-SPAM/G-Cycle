import { SafeAreaProvider } from "react-native-safe-area-context";

import { Toast } from "@components/feedback";

import { QueryProvider } from "./QueryProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

/** One place to stack every top-level provider — keeps App.tsx a plain composition root. */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        {children}
        <Toast />
      </QueryProvider>
    </SafeAreaProvider>
  );
}
