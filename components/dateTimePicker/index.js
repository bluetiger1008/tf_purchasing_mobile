import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import _find from 'lodash/find'
import moment from 'moment'

const DateTimePicker = ({
  selectedDate,
  style,
  arrowColor,
  onDateChange,
  title,
  mode = 'date',
  format = 'MM/DD/YYYY',
  disabled,
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }

  const hideDatePicker = () => {
    setDatePickerVisibility(false)
  }

  const handleConfirm = (date) => {
    hideDatePicker()
    onDateChange(date)
  }

  return (
    <>
      {title && (
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 10 }}>
          {title}
        </Text>
      )}
      <TouchableOpacity disabled={disabled} onPress={showDatePicker}>
        <View
          style={style ? { ...styles.basic, ...style } : styles.defaultWrapper}
        >
          <Text>{moment(selectedDate).format(format)}</Text>
          <MaterialIcons name='event' size={20} color={arrowColor || 'black'} />
        </View>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={mode}
        date={new Date(selectedDate)}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
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
  },
})

export default DateTimePicker
