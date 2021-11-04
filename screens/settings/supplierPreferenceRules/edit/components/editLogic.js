import React, { useState, useEffect } from 'react'
import {
  View,
  Picker,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import { Text, Button, RadioButton } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import { MultiPicker } from 'components'
import { SinglePicker } from 'components'

import _find from 'lodash/find'

const EditLogic = ({
  suppliers,
  manufacturers,
  logic = null,
  onUpdateLogic,
  onClose,
  isAdding = false,
}) => {
  const [rank, setRank] = useState('')
  const [buyFrom, setBuyFrom] = useState('')
  const [selectedSuppliers, setSelectedSuppliers] = useState([])
  const [manufacturer, setManufacturer] = useState('')
  const [selectedManufacturers, setSelectedManufacturers] = useState([])

  useEffect(() => {
    if (isAdding) {
      setRank('')
      setBuyFrom('')
      setSelectedSuppliers([])
      setManufacturer('')
      setSelectedManufacturers([])
    }
  }, [])

  useEffect(() => {
    if (logic) {
      setRank(logic.rank)
      if (logic.supplier_ids[0] === 'all') {
        setBuyFrom('any_supplier')
      } else {
        setBuyFrom('specific_supplier')
        setSelectedSuppliers(logic.supplier_ids)
      }

      if (logic.manufacturer_ids[0] === 'all') {
        setManufacturer('any_manufacturer')
      } else {
        setManufacturer('specific_manufacturer')
        setSelectedManufacturers(logic.manufacturer_ids)
      }
    }
  }, [logic])

  const onChangeRank = (value) => {
    setRank(value)
  }

  const onChangeBuyFrom = (value) => {
    setBuyFrom(value)
  }

  const onChangeManufacturer = (value) => {
    setManufacturer(value)
  }

  const onChangeSupplier = (value) => {
    setSelectedSuppliers(value)
  }

  const onChangeManufacturers = (value) => {
    setSelectedManufacturers(value)
  }

  const onUpdate = () => {
    const updateObj = {
      supplier_ids: buyFrom === 'any_supplier' ? 'all' : selectedSuppliers,
      manufacturer_ids:
        manufacturer === 'any_manufacturer' ? 'all' : selectedManufacturers,
      rank,
    }
    onUpdateLogic(updateObj)
  }

  const RANK = [
    {
      label: '1',
      value: 1,
    },
    {
      label: '2',
      value: 2,
    },
    {
      label: '3',
      value: 3,
    },
    {
      label: '-1',
      value: -1,
    },
  ]

  return (
    <View style={styles.modalWrapper}>
      <View style={styles.header}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
          Supplier Part Number Rule
        </Text>

        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
          <MaterialIcons name='close' size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{
          ...styles.content,
          maxHeight: Dimensions.get('window').height * 0.7,
        }}
      >
        <SinglePicker
          title='Rank'
          style={{ marginBottom: 10 }}
          list={RANK}
          id='value'
          label='label'
          selectedValue={rank}
          onChangeValue={(value) => onChangeRank(value.id)}
        />

        <Text>Buy Form:</Text>
        <RadioButton.Group onValueChange={onChangeBuyFrom} value={buyFrom}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton.Android value='any_supplier' color='#e82559' />
            <Text>Any Supplier</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton.Android value='specific_supplier' color='#e82559' />
            <Text>Specific Supplier(s)</Text>
          </View>
        </RadioButton.Group>

        <MultiPicker
          style={{ marginBottom: 10 }}
          disabled={buyFrom === 'any_supplier'}
          label={'Suppliers'}
          selectedItems={selectedSuppliers}
          onSelectedItemsChange={onChangeSupplier}
          options={suppliers.map((e, i) => {
            return { name: e.name, id: e.id }
          })}
        />

        <Text>In:</Text>
        <RadioButton.Group
          onValueChange={onChangeManufacturer}
          value={manufacturer}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton.Android value='any_manufacturer' color='#e82559' />
            <Text>Any Manufacturer</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton.Android
              value='specific_manufacturer'
              color='#e82559'
            />
            <Text>Specific Manufacturer(s)</Text>
          </View>
        </RadioButton.Group>

        <MultiPicker
          label={'Manufacturer'}
          disabled={manufacturer === 'any_manufacturer'}
          selectedItems={selectedManufacturers}
          onSelectedItemsChange={onChangeManufacturers}
          options={manufacturers.map((e, i) => {
            return { name: e.name, id: e.id }
          })}
        />
      </ScrollView>
      <View style={styles.footer}>
        <Button
          style={{ ...styles.button, marginTop: 12 }}
          mode='contained'
          onPress={onUpdate}
        >
          Update
        </Button>
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
  header: {
    backgroundColor: '#FFF',
    width: '90%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 10,
  },
  footer: {
    backgroundColor: '#FFF',
    width: '90%',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 10,
  },
  content: {
    width: '90%',
    paddingHorizontal: 20,
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
    top: 7,
    right: 7,
    padding: 4,
  },
  textInput: {
    backgroundColor: '#FFF',
    marginVertical: 0,
    paddingVertical: 0,
    marginBottom: 10,
  },
})

export default EditLogic
