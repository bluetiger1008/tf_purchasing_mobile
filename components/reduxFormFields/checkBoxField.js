import React, { useState } from 'react'
import { View } from 'react-native'
import { CheckBox, Text } from 'react-native-elements'

const ReduxCheckBoxField = ({ input, label, disabled, clickable = true }) => {
  const [selected, setSelected] = useState(!!input.value)

  return (
    <CheckBox
      title={label}
      onPress={() => {
        setSelected((prev) => {
          input.onChange(!prev)
          return !prev
        })
      }}
      disabled={disabled}
      iconType='material-community'
      checkedIcon='checkbox-marked'
      uncheckedIcon='checkbox-blank-outline'
      checkedColor='red'
      checked={selected}
      containerStyle={{
        backgroundColor: 'transparent',
        borderWidth: 0,
        marginLeft: 0,
      }}
    />
  )
}

export default ReduxCheckBoxField
