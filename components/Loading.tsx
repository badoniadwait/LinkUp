import { theme } from '@/constants/theme'
import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

const Loading = (
    {size = "large", color = theme.colors.primary}
) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})