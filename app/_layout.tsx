import '@/global.css';
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
   throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in .env");
}

export default function RootLayout() {
   const [fontsLoaded, fontError] = useFonts({
      "Sans-Regular": require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
      "Sans-Bold": require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
      "Sans-Medium": require("@/assets/fonts/PlusJakartaSans-Medium.ttf"),
      "Sans-SemiBold": require("@/assets/fonts/PlusJakartaSans-SemiBold.ttf"),
      "Sans-ExtraBold": require("@/assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
      "Sans-Light": require("@/assets/fonts/PlusJakartaSans-Light.ttf"),
   });

   useEffect(() => {
      if (fontsLoaded || fontError) {
         SplashScreen.hideAsync();
      }
   }, [fontsLoaded, fontError]);

   if (!fontsLoaded && !fontError) {
      return null;
   }

   return (
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
         <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="subscriptions/[id]" />
         </Stack>
      </ClerkProvider>
   );
}
