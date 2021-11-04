import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const Users = () => {
  return (
    <View style={styles.content}>
      <Text>Users</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
  },
})

export default Users
