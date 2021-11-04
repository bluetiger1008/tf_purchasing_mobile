import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import ModalSelector from 'react-native-modal-selector'
import _find from 'lodash/find'

const SinglePicker = ({
  list,
  selectedValue,
  id,
  label,
  style,
  textStyle,
  arrowColor,
  onChangeValue,
  title,
  disabled = false,
}) => {
  const selectedObject =
    selectedValue !== undefined && list.length > 0
      ? _find(list, { [id]: selectedValue })
      : null
  const selectedText = selectedObject ? selectedObject[label] : '-- --'

  const containerStyle = disabled ? styles.disabled : styles.basic
  return (
    <>
      {title && (
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginVertical: 5 }}>
          {title}
        </Text>
      )}
      <ModalSelector
        disabled={disabled}
        animationType='fade'
        data={list}
        keyExtractor={(item) => item[id]}
        labelExtractor={(item) => item[label]}
        initValue='Select a Value'
        onChange={(value) => {
          onChangeValue(value)
        }}
      >
        <View style={style ? { ...containerStyle, ...style } : containerStyle}>
          <Text style={{ color: disabled ? '#bfbfbf' : 'black', ...textStyle }}>
            {selectedText}
          </Text>
          <MaterialIcons
            name='arrow-drop-down'
            size={20}
            color={disabled ? '#bfbfbf' : arrowColor || 'black'}
          />
        </View>
      </ModalSelector>
    </>
  )
}

const styles = StyleSheet.create({
  basic: {
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 90,
    minHeight: 50,
  },
  disabled: {
    padding: 10,
    borderColor: '#bfbfbf',
    borderWidth: 1,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 90,
    minHeight: 50,
  },
  defaultWrapper: {
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 90,
    minHeight: 50,
  },
})

export default SinglePicker
