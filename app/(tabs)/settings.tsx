import { useClerk, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
// reason to do that , SAV is from react-native-safe-area-context and it doesn't support className prop, so we need to wrap it with styled from nativewind to use className prop on it.

// check readmenote for detial explanation about this issue : Why `className` didn't work on `SafeAreaView`
const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="sub-card bg-card">
        <Text className="list-title">Settings</Text>
        <Text className="mt-2 text-base font-sans-medium text-muted-foreground">
          Signed in as {user?.primaryEmailAddress?.emailAddress ?? "your account"}
        </Text>

        <Pressable className="sub-cancel mt-6" onPress={() => signOut()}>
          <Text className="sub-cancel-text">Sign out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Settings