import { useAuth } from "@clerk/expo";
import { usePostHog } from "posthog-react-native";
import { useEffect } from "react";
import { Link, Redirect, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SubscriptionsDetails = () => {
    const { isLoaded, isSignedIn } = useAuth();
    const { id } = useLocalSearchParams<{ id: string }>();

    const posthog = usePostHog();

    useEffect(() => {
      if (isLoaded && isSignedIn && id) {
        try {
          posthog?.capture?.("subscription_details_viewed", { subscriptionId: id });
        } catch {}
      }
    }, [isLoaded, isSignedIn, id]);

    if (!isLoaded) {
      return null;
    }

    if (!isSignedIn) {
      return <Redirect href="/(auth)/sign-in" />;
    }

  return (
    <View className="flex-1 bg-background p-5">
      <View className="sub-card bg-card">
        <Text className="list-title">Subscription details</Text>
        <Text className="mt-4 text-base font-sans-medium text-primary">Subscription ID: {id}</Text>
        <Link href="/(tabs)">
          <Text className="mt-6 font-sans-bold text-accent">Back to home</Text>
        </Link>
      </View>
    </View>
  );
};

export default SubscriptionsDetails