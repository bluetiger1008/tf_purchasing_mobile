import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Picker } from 'react-native'
import { HelperText, Text } from 'react-native-paper'

const ReduxSelectField = ({
  input,
  label,
  meta: { touched, error },
  children,
  fullWidth,
  ...custom
}) => {
  const [hasTouched, setHasTouched] = useState(false)

  return (
    <View style={styles.wrapper}>
      {hasTouched && error && <HelperText type='error'>{error}</HelperText>}
      <Text>{label}</Text>
      <Picker
        {...input}
        collapsable={true}
        selectedValue={input.value}
        onValueChange={(itemValue, itemIndex) => {
          input.onChange(itemValue)
          setHasTouched(true)
        }}
      >
        {children}
      </Picker>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomColor: '#808080',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
})

export default ReduxSelectField
