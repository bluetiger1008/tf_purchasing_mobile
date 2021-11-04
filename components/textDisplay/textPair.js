import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'

const TextPair = ({ text, value, style }) => {
  return (
    <View style={style}>
      <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{text}</Text>
      <Text style={{ fontSize: 14, color: 'gray', paddingLeft: 10 }}>
        {value}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default TextPair
