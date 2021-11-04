import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { HelperText, Text, RadioButton } from 'react-native-paper'

const ReduxRadioButtonField = ({
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
      <RadioButton.Group
        {...input}
        value={input.value}
        onValueChange={(itemValue, itemIndex) => {
          input.onChange(itemValue)
          setHasTouched(true)
        }}
      >
        {children}
      </RadioButton.Group>
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

export default ReduxRadioButtonField
