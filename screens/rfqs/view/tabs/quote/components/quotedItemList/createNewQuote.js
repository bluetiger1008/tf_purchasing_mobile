import React, { useState, useEffect, useContext } from 'react'
import { View, StyleSheet, Picker, Dimensions, ScrollView } from 'react-native'
import { Text, Button, TextInput, Checkbox } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'

import { createRfqQuoteAPI } from 'services/helpers/apis/rfq'

import { useRfqListContext } from '../../../../../context'
import { GlobalContext } from '../../../../../../../Main'
import leadTimeValues from 'utils/leadTimes'
import { SinglePicker } from 'components'

const CreateNewQuote = ({ onClose, uuid, onAddQuote }) => {
  const context = useContext(GlobalContext)
  const { manufacturerList } = useRfqListContext()
  const [loading, setLoading] = useState(false)
  const [inputValues, setInputValues] = useState({
    quantity: 0,
    part_number: '',
    price: 0,
    manufacturer_id: '',
    lead_time: '',
    supplier_part_number: '',
    supplier_part_number_custom: false,
  })

  const handleInput = (name, value) => {
    setInputValues({ ...inputValues, [name]: value })
  }

  const onSaveQuote = async () => {
    try {
      const createdRfqResponse = await createRfqQuoteAPI({
        ...inputValues,
        item: inputValues.part_number,
        rfq_uuid: uuid,
      })

      onAddQuote(createdRfqResponse.data.data)
      onClose()
    } catch (error) {
      context.onApiError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.modalWrapper}>
      <View style={styles.content} contentContainerStyle={styles.content}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
          Create New Quote
        </Text>

        <ScrollView>
          <TextInput
            mode='outlined'
            keyboardType={'numeric'}
            style={styles.textInput}
            label='Quantity'
            value={inputValues.quantity}
            onChangeText={(e) => {
              handleInput('quantity', e)
            }}
          />

          <TextInput
            mode='outlined'
            style={styles.textInput}
            label='Part Number'
            value={inputValues.part_number}
            onChangeText={(e) => {
              handleInput('part_number', e)
            }}
          />

          <TextInput
            mode='outlined'
            style={styles.textInput}
            label='Supplier Part Number'
            value={inputValues.supplier_part_number}
            onChangeText={(e) => {
              handleInput('supplier_part_number', e)
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <Checkbox.Android
              status={
                inputValues.supplier_part_number_custom
                  ? 'checked'
                  : 'unchecked'
              }
              onPress={() => {
                handleInput(
                  'supplier_part_number_custom',
                  !inputValues.supplier_part_number_custom
                )
              }}
            />
            <Text style={{ fontSize: 14 }}>Custom</Text>
          </View>
          <SinglePicker
            title='Manufacturer'
            style={{ marginBottom: 10 }}
            list={manufacturerList}
            id='id'
            label='name'
            selectedValue={inputValues.manufacturer_id}
            onChangeValue={(value) => handleInput('manufacturer_id', value.id)}
          />

          <SinglePicker
            title='Lead Time'
            style={{ marginBottom: 10 }}
            list={leadTimeValues}
            id='value'
            label='label'
            selectedValue={inputValues.lead_time}
            onChangeValue={(value) => handleInput('lead_time', value.value)}
          />

          <TextInput
            mode='outlined'
            keyboardType='numeric'
            style={styles.textInput}
            label='Price'
            value={inputValues.price}
            onChangeText={(e) => {
              handleInput('price', e)
            }}
          />
        </ScrollView>

        <Button
          loading={loading}
          disabled={loading}
          style={{ ...styles.button, marginTop: 12 }}
          mode='contained'
          onPress={onSaveQuote}
        >
          Save
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

export default CreateNewQuote
