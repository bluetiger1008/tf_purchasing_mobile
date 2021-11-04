import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { HelperText, Text } from 'react-native-paper'
import { SinglePicker } from 'components'

const ReduxSingleSelectField = ({
  input,
  label,
  text,
  meta: { touched, error },
  id,
  title,
  options,
  onChangeValue,
}) => {
  const [hasTouched, setHasTouched] = useState(false)

  return (
    <>
      <SinglePicker
        title={label}
        style={{ marginBottom: 10 }}
        list={options}
        id={id}
        label={text}
        selectedValue={input.value}
        onChangeValue={(value) => {
          input.onChange(value[id])
          setHasTouched(true)
        }}
      />
      {hasTouched && error && <HelperText type='error'>{error}</HelperText>}
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomColor: '#808080',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
})

export default ReduxSingleSelectField
