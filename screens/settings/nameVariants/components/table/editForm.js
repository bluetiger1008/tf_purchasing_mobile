import React from 'react'
import { View, StyleSheet } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import _find from 'lodash/find'
import { MaterialIcons } from '@expo/vector-icons'
import { SinglePicker } from 'components'

const EditForm = ({ row, tableType, updateItem, list, onClose, onDelete }) => {
  const associateId =
    tableType === 'supplier' ? row.supplier_id : row.manufacturer_id
  const [selectedValue, setSelectedValue] = React.useState(associateId)
  const handleChange = (_value) => {
    setSelectedValue(_value)
  }

  return (
    <>
      <View style={styles.modalWrapper}>
        <View style={styles.content}>
          <TextInput
            style={styles.textInput}
            label='Name Variant'
            value={row.name_variant}
            disabled
          />
          <TextInput
            style={styles.textInput}
            label='Service'
            value={row.service_name}
            disabled
          />

          <SinglePicker
            title={tableType == 'supplier' ? 'Supplier' : 'Manufacturer'}
            style={{ marginBottom: 10 }}
            list={list}
            id='id'
            label='name'
            selectedValue={selectedValue}
            onChangeValue={(value) => handleChange(value.id)}
          />

          <Button
            disabled={associateId == selectedValue}
            mode='contained'
            onPress={() => updateItem(selectedValue)}
          >
            Update
          </Button>

          <Button
            mode='contained'
            color='red'
            onPress={onDelete}
            style={{ marginTop: 10 }}
          >
            Delete
          </Button>

          <MaterialIcons
            name='close'
            color='gray'
            size={20}
            style={{ position: 'absolute', top: 15, right: 15 }}
            onPress={onClose}
          />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    marginVertical: 10,
    marginBottom: 15,
    marginHorizontal: 10,
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
  },
})

export default EditForm
