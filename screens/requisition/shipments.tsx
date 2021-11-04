import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Title } from 'react-native-paper'

const Shipments = () => {
  return (
    <View style={styles.container}>
      <Title>Shipments</Title>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
})

export default Shipments
