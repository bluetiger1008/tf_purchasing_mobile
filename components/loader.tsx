import React from 'react'
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native'

const Loader = () => {
  return (
    <View style={styles.loaderWrapper}>
      <ActivityIndicator
        size='large'
        color='#0000ff'
        style={{ marginRight: 20 }}
      />
      <Text style={{ fontSize: 20 }}>Loading...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  loaderWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 100,
  },
})

export default Loader
