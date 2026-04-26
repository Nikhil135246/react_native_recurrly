import { Text } from 'react-native'
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import {styled} from "nativewind";
// reason to do that , SAV is from react-native-safe-area-context and it doesn't support className prop, so we need to wrap it with styled from nativewind to use className prop on it.

// check readmenote for detial explanation about this issue : Why `className` didn't work on `SafeAreaView`
const SafeAreaView = styled(RNSafeAreaView);
import React from 'react'

const insights = () => {
  return (
    <SafeAreaView>
      <Text>insights</Text>
    </SafeAreaView>
  )
}

export default insights