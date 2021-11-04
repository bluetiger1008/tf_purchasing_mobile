import React, { useState, useContext, useCallback } from 'react'
import { View, StyleSheet, TouchableOpacity, Picker } from 'react-native'
import { TextInput, Text, Button } from 'react-native-paper'

import { MaterialIcons } from '@expo/vector-icons'
import { createPoLineAPI, deletePoLineAPI } from 'services/helpers/apis/po'
import leadTimeValues from 'utils/leadTimes'
import { SinglePicker } from 'components'

import { GlobalContext } from '../../../../../Main'

const AddLine = ({ onClose, purchaseOrderData, onLineAdded }) => {
  const context = useContext(GlobalContext)
  const [loading, setLoading] = useState(false)
  const [inputValues, setInputValues] = useState({
    quantity: '',
    item: '',
    unit_cost: '',
    lead_time: '',
  })

  const handlerChange = (property, value) => {
    const tempInputValues = { ...inputValues }
    tempInputValues[property] = value
    setInputValues(tempInputValues)
  }

  const onAddNewLine = async () => {
    setLoading(true)
    try {
      const createdPoResponse = await createPoLineAPI({
        ...inputValues,
        po_id: purchaseOrderData.id,
      })
      context.onApiSuccess('New line item is added')
      onLineAdded(createdPoResponse.data.data)
      onClose()
    } catch (error) {
      context.onApiError(error)
    } finally {
      setLoading(false)
    }
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

          <TextInput
            keyboardType='numeric'
            mode='outlined'
            style={styles.textInput}
            label='Part Number'
            value={inputValues.item}
            onChangeText={(e) => {
              handlerChange('item', e)
            }}
          />

          <SinglePicker
            title='Lead time'
            style={{ marginBottom: 10 }}
            list={leadTimeValues}
            id='value'
            label='label'
            selectedValue={inputValues.lead_time}
            onChangeValue={(value) => handlerChange('lead_time', value.value)}
          />

          <TextInput
            keyboardType='numeric'
            mode='outlined'
            style={styles.textInput}
            label='Unit Cost'
            value={inputValues.unit_cost}
            onChangeText={(e) => {
              handlerChange('unit_cost', e)
            }}
          />

          <Button
            loading={loading}
            disabled={loading}
            style={{ ...styles.button, marginTop: 12 }}
            mode='contained'
            onPress={() => {
              onAddNewLine(inputValues)
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
