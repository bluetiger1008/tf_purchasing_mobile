import React, { useEffect, useContext, useState } from 'react'
import { View, StyleSheet, Modal, TouchableOpacity, Picker } from 'react-native'
import { TextInput, Text, Button } from 'react-native-paper'
import { GlobalContext } from '../../../../../Main'
import leadTimeValues from 'utils/leadTimes'

import { MaterialIcons } from '@expo/vector-icons'
import { SinglePicker } from 'components'

import { updatePoLineAPI, deletePoLineAPI } from 'services/helpers/apis/po'

const EditLine = ({
  selectedLine,
  onClose,
  manufacturerList,
  onUpdateLine,
  onDeleteLine,
  permitted,
}) => {
  const [loading, setLoading] = useState(false)
  const {
    requisition_detail,
    quantity,
    manufacturer,
    supplier_part_number,
    item,
    unit_cost,
    extended_cost,
    dispatch_schedule,
  } = selectedLine
  const context = useContext(GlobalContext)
  const [inputValues, setInputValues] = useState({
    quantity: quantity.toString(),
    part_number: item,
    supplier_part_number: supplier_part_number,
    manufacturer_id: manufacturer ? manufacturer.id : 0,
    unit_cost,
    extended_cost,
    dispatch_schedule: [],
  })

  useEffect(() => {
    const defaultSchedule = dispatch_schedule.map((e) => {
      return {
        quantity: e.quantity.toString(),
        lead_time: e.lead_time_menu,
      }
    })
    setInputValues({ ...inputValues, dispatch_schedule: defaultSchedule })
  }, [])

  const handlerChange = (property, value) => {
    const tempInputValues = { ...inputValues }
    tempInputValues[property] = value
    setInputValues(tempInputValues)
  }

  const arrayHandlerChange = (property, id, value) => {
    const tempInputValues = { ...inputValues }
    const rowIndex = tempInputValues.dispatch_schedule.findIndex(
      (row, index) => index === id
    )
    tempInputValues.dispatch_schedule[rowIndex][property] = value
    setInputValues(tempInputValues)
  }

  const _onUpdateLine = async () => {
    setLoading(true)

    try {
      const updatedPoLineResponse = await updatePoLineAPI(selectedLine.uuid, {
        dispatch_schedule: inputValues.dispatch_schedule,
      })
      onUpdateLine(updatedPoLineResponse.data.data.line)

      context.onApiSuccess('Selected line item is updated.')
    } catch (error) {
      console.log(error, 'error')
      context.onApiError(error)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  const _onDeleteLine = async () => {
    setLoading(true)
    try {
      await deletePoLineAPI(selectedLine.uuid)
      onDeleteLine(selectedLine.uuid)
      context.onApiSuccess('Line deleted successfully')
    } catch (e) {
      console.log(e, 'error')
      context.onApiError(e)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <>
      <View style={styles.modal_wrapper}>
        <View style={styles.content}>
          <Text
            style={{
              fontSize: 16,
              marginBottom: 10,
            }}
          >
            Requisition ID: {requisition_detail.order_id}
          </Text>

          <TextInput
            disabled
            keyboardType='numeric'
            mode='outlined'
            style={styles.textInput}
            label='Quantity'
            value={inputValues.quantity}
            onChangeText={(e) => {
              handlerChange('quantity', e)
            }}
          />

          {/* Insert Manufacturer */}

          <SinglePicker
            disabled
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
            disabled
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
            disabled
            mode='outlined'
            style={styles.textInput}
            label='Supplier Part Number'
            value={inputValues.supplier_part_number}
            onChangeText={(e) => {
              handlerChange('supplier_part_number', e)
            }}
          />

          {inputValues.dispatch_schedule.map((schedule, index) => {
            return (
              <View key={index}>
                <TextInput
                  keyboardType='numeric'
                  mode='outlined'
                  style={styles.textInput}
                  label='Quantity'
                  value={schedule.quantity}
                  onChangeText={(e) => {
                    arrayHandlerChange(`quantity`, index, e)
                  }}
                />

                {/* Insert Manufacturer */}

                <SinglePicker
                  title='Lead time'
                  style={{ marginBottom: 10 }}
                  list={leadTimeValues}
                  id='value'
                  label='label'
                  selectedValue={schedule.lead_time}
                  onChangeValue={(value) =>
                    arrayHandlerChange(`lead_time`, index, value.value)
                  }
                />
              </View>
            )
          })}

          <Button
            loading={loading}
            disabled={loading || !permitted}
            style={{ ...styles.button, marginTop: 12 }}
            mode='contained'
            onPress={_onUpdateLine}
          >
            Update
          </Button>

          <Button
            loading={loading}
            disabled={loading || !permitted}
            style={{ ...styles.button }}
            mode='contained'
            color='red'
            onPress={_onDeleteLine}
          >
            Delete
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

export default EditLine
