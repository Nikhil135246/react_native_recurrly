import '@/global.css';
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

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

   // Mount ClerkProvider immediately so Clerk can initialize in parallel with fonts.
   return (
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
         <InnerApp fontsLoaded={fontsLoaded} fontError={fontError} />
      </ClerkProvider>
   );
}

function InnerApp({ fontsLoaded, fontError }: { fontsLoaded: boolean; fontError: Error | null }) {
   const { isLoaded: authLoaded } = useAuth();
   const [readyToShow, setReadyToShow] = useState(false);

   useEffect(() => {
      let mounted = true;

      const tryShow = async () => {
         if ((fontsLoaded || !!fontError) && authLoaded && mounted) {
            try {
               await SplashScreen.hideAsync();
            } catch (err) {
               // ignore
            }
            if (mounted) setReadyToShow(true);
         }
      };

      tryShow();

      return () => {
         mounted = false;
      };
   }, [fontsLoaded, fontError, authLoaded]);

   if (!readyToShow) {
      return null;
   }

   return (
      <Stack screenOptions={{ headerShown: false }}>
         <Stack.Screen name="(tabs)" />
         <Stack.Screen name="(auth)" />
         <Stack.Screen name="onboarding" />
         <Stack.Screen name="subscriptions/[id]" />
      </Stack>
   );
}
