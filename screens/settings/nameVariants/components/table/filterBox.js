import React, { useState } from 'react'
import { StyleSheet, View, Picker } from 'react-native'
import { Text, Button, TextInput, Checkbox } from 'react-native-paper'
import _find from 'lodash/find'
import { MaterialIcons } from '@expo/vector-icons'

const FilterBox = ({ services, onChangeFilter, onClose, defaultValues }) => {
  const [serviceValue, setServiceValue] = useState(defaultValues.serviceId)
  const [searchTerm, setSearchTerm] = useState(defaultValues.searchTerm)
  const [unAssignedVariant, setUnAssignedVariant] = useState(
    defaultValues.unassociated
  )

  const onSelectService = (value) => {
    setServiceValue(value)
  }

  const onSubmitFilter = () => {
    onClose()
    onChangeFilter(serviceValue, searchTerm, unAssignedVariant)
  }
  return (
    <View style={styles.modalWrapper}>
      <View style={styles.content}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
          Filter By:
        </Text>

        <TextInput
          mode='outlined'
          style={styles.textInput}
          label='Search value'
          value={searchTerm}
          onChangeText={(e) => {
            setSearchTerm(e)
          }}
        />

        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Services</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            onValueChange={onSelectService}
            collapsable={false}
            mode='dropdown'
            selectedValue={serviceValue}
          >
            <Picker.Item label={'-- --'} value={''} />
            {services.map((item, i) => (
              <Picker.Item label={item} value={item} key={i} />
            ))}
          </Picker>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Checkbox
            status={unAssignedVariant ? 'checked' : 'unchecked'}
            onPress={() => {
              setUnAssignedVariant(!unAssignedVariant)
            }}
          />
          <Text style={{ fontSize: 14 }}>
            Show only unassigned name variants
          </Text>
        </View>

        <Button
          style={{ ...styles.button, marginTop: 12 }}
          mode='contained'
          onPress={onSubmitFilter}
        >
          Filter
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
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  pickerWrapper: {
    borderRadius: 8,
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

export default FilterBox
