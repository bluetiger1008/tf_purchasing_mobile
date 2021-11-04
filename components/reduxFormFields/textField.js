import React from 'react'
import { View } from 'react-native'
import { TextInput, HelperText } from 'react-native-paper'

const ReduxTextField = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) => {
  return (
    <View>
      <TextInput
        style={{
          backgroundColor: '#FFF',
          marginVertical: 0,
          paddingVertical: 0,
        }}
        label={label}
        secureTextEntry={custom?.type === 'password'}
        text={input.value}
        onChangeText={(text) => {
          input.onChange(text)
        }}
        {...input}
        {...custom}
      />
      {touched && error && <HelperText type='error'>{error}</HelperText>}
    </View>
  )
}

export default ReduxTextField
