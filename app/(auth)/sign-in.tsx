import { View, Text } from 'react-native'
<<<<<<< HEAD

=======
import React from 'react'
>>>>>>> 93a1e9cd4b43e501900e1b677cb4b908f7c5ff12
import { Link } from 'expo-router'

const SignIn = () => {
  return (
    <View>
      <Text>SignIn</Text>
      <Link href="/(auth)/sign-up">Create Account</Link>
    </View>
  )
}

export default SignIn