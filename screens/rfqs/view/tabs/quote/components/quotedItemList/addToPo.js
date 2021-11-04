import React, { useState, useEffect, useContext } from 'react'
import { View, StyleSheet, Picker, Dimensions, Alert } from 'react-native'
import { Text, Button } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'

import { createBatchPoLineAPI } from 'services/helpers/apis/po'

import { GlobalContext } from '../../../../../../../Main'
import { getApiClient } from 'services/helpers/apiConfig'

const AddToPo = ({ onClose, selectedQuotes, supplierId }) => {
  const context = useContext(GlobalContext)
  const [loading, setLoading] = useState(false)
  const [poList, setPoList] = React.useState([])
  const [selectedPo, setSelectedPo] = useState(null)
  const fetchPoList = async () => {
    const client = await getApiClient()
    try {
      const res = await client.get(
        `po/list?status=draft&supplier_id=${supplierId}`
      )
      setPoList(res.data.data.purchase_order)
    } catch (e) {
      console.log(e, 'error')
      context.onApiError(e)
    }
  }

  useEffect(() => {
    fetchPoList()
  }, [])

  const handleSelect = (value) => {
    setSelectedPo(value)
  }

  const alertSuccess = (addedData) => {
    Alert.alert(
      'Success',
      `The lines were successfully added to ${
        (addedData ? `PO ${addedData.po.id}` : 'new PO',
        [
          {
            text: 'Close',
            onPress: () => {},
          },
        ])
      }`
    )
  }

  const onConfirm = async () => {
    let rfqQuoteLines = []
    selectedQuotes.map((line) => {
      rfqQuoteLines = [...rfqQuoteLines, line.rfq_quote_line_uuid]
      return rfqQuoteLines
    })
    setLoading(true)
    try {
      const res = await createBatchPoLineAPI(
        rfqQuoteLines,
        selectedPo ? selectedPo : null
      )

      alertSuccess(res.data.data)
    } catch (e) {
      context.onApiError(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.modalWrapper}>
      <View style={styles.content} contentContainerStyle={styles.content}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
          Add to PO
        </Text>

        <View style={styles.pickerWrapper}>
          <Picker
            onValueChange={handleSelect}
            collapsable={false}
            mode='dropdown'
            selectedValue={selectedPo}
          >
            <Picker.Item label={`New PO`} value={null} />
            {poList.map((item, i) => (
              <Picker.Item label={`PO ${item.id}`} value={item.id} key={i} />
            ))}
          </Picker>
        </View>

        <Button
          loading={loading}
          disabled={loading}
          style={{ ...styles.button, marginTop: 12 }}
          mode='contained'
          onPress={onConfirm}
        >
          Confirm Add to PO
        </Button>

        <MaterialIcons
          name='close'
          size={20}
          style={styles.closeIcon}
          onPress={onClose}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: '#00000066',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '90%',
    maxHeight: Dimensions.get('screen').height * 0.7,
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#FFF',
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
})

export default AddToPo
