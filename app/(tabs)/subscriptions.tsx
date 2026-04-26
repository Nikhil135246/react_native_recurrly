import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import {styled} from "nativewind";
// reason to do that , SAV is from react-native-safe-area-context and it doesn't support className prop, so we need to wrap it with styled from nativewind to use className prop on it.

// check readmenote for detial explanation about this issue : Why `className` didn't work on `SafeAreaView`
const SafeAreaView = styled(RNSafeAreaView);
const subscriptions = () => {
  return (
    <SafeAreaView>
      <Text>subscriptions</Text>
    </SafeAreaView>
  )
}

export default subscriptions