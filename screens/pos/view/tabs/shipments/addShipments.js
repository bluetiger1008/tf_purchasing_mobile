import React, { useState, useContext } from 'react'
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { TextInput, Text, Button } from 'react-native-paper'
import { GlobalContext } from '../../../../../Main'

import { MaterialIcons } from '@expo/vector-icons'
import { createShipmentAPI } from 'services/helpers/apis/shipment'

import PartNumberTable from '../../../components/partNumberTable'

const AddShipments = ({ onClose, onAddedShipment, remainingLines = [] }) => {
  const context = useContext(GlobalContext)
  const [loading, setLoading] = useState(false)
  const [linesData, setLinesData] = useState([])
  const [trackingNumber, setTrackingNumber] = useState('')

  const onChangeTrackingNumber = (value) => {
    setTrackingNumber(value)
  }

  const onSelectLine = (selectedLines) => {
    setLinesData(selectedLines)
  }

  const onAddShipment = async () => {
    setLoading(true)
    const lineDataRequest = linesData.map((line) => ({
      quantity: line.quantity,
      purchase_order_line_uuids: line.purchase_order_line_uuids,
    }))

    try {
      await createShipmentAPI({
        tracking_number: trackingNumber,
        lines: lineDataRequest,
      })
      context.onApiSuccess('New shipment is created')
      onAddedShipment()
    } catch (e) {
      context.onApiError(e)
    } finally {
      setLoading(false)
    }
  }
  return (
    <View style={styles.modal_wrapper}>
      <View style={styles.content}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
          Add a shipment
        </Text>

        <TextInput
          mode='outlined'
          style={styles.textInput}
          label='Tracking Number'
          value={trackingNumber}
          onChangeText={onChangeTrackingNumber}
        />

        <PartNumberTable lines={remainingLines} onSelectLine={onSelectLine} />
        <Button
          loading={loading}
          disabled={loading || trackingNumber == '' || linesData.length <= 0}
          style={{ ...styles.button, marginTop: 12 }}
          mode='contained'
          onPress={onAddShipment}
        >
          Submit
        </Button>

        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
          <MaterialIcons name='close' size={20} />
        </TouchableOpacity>
      </View>
    </View>
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
    maxHeight: Dimensions.get('screen').height * 0.7,
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

export default AddShipments
