import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Picker } from 'react-native'
import { TextInput, Text, Button } from 'react-native-paper'

import { MaterialIcons } from '@expo/vector-icons'
import { SinglePicker } from 'components'

const AddLine = ({ onClose, manufacturerList, onSave }) => {
  const [loading, setLoading] = useState(false)
  const [inputValues, setInputValues] = useState({
    quantity: '',
    part_number: '',
    supplier_part_number: '',
    manufacturer_id: '',
  })

  const handlerChange = (property, value) => {
    const tempInputValues = { ...inputValues }
    tempInputValues[property] = value
    setInputValues(tempInputValues)
  }

  return (
    <>
      <View style={styles.modal_wrapper}>
        <View style={styles.content}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
            Add Line
          </Text>

          <TextInput
            keyboardType='numeric'
            mode='outlined'
            style={styles.textInput}
            label='Quantity'
            value={inputValues.quantity}
            onChangeText={(e) => {
              handlerChange('quantity', e)
            }}
          />

          <SinglePicker
            title='Manufacturer'
            style={{ marginBottom: 10 }}
            list={manufacturerList}
            id='id'
            label='name'
            selectedValue={inputValues.manufacturer_id}
            onChangeValue={(value) =>
              handlerChange('manufacturer_id', value.id)
            }
          />

          <TextInput
            keyboardType='numeric'
            mode='outlined'
            style={styles.textInput}
            label='Part Number'
            value={inputValues.part_number}
            onChangeText={(e) => {
              handlerChange('part_number', e)
            }}
          />

          <TextInput
            keyboardType='numeric'
            mode='outlined'
            style={styles.textInput}
            label='Supplier Part Number'
            value={inputValues.supplier_part_number}
            onChangeText={(e) => {
              handlerChange('supplier_part_number', e)
            }}
          />

          <Button
            loading={loading}
            disabled={loading}
            style={{ ...styles.button, marginTop: 12 }}
            mode='contained'
            onPress={() => {
              setLoading(true)
              onSave(inputValues)
            }}
          >
            Save
          </Button>

          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <MaterialIcons name='close' size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  modal_wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: '#0000004D',
  },
  content: {
    width: '90%',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  uploadLogo: {
    height: 80,
    width: 100,
    borderRadius: 8,
    borderColor: '#808080',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderStyle: 'dashed',
  },
  imageLogo: {
    height: 80,
    width: 100,
    borderRadius: 8,
    borderColor: '#808080',
    marginVertical: 10,
  },
  closeIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  textInput: {
    backgroundColor: '#FFF',
    marginVertical: 0,
    paddingVertical: 0,
    marginBottom: 10,
  },
  pickerWrapper: {
    borderColor: '#000',
    borderWidth: 0.5,
    marginTop: 5,
    marginBottom: 10,
  },
  button: {
    marginVertical: 7,
  },
})

export default AddLine
