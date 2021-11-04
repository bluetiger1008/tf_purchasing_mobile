import React, { useState } from 'react'
import { StyleSheet, View, Picker } from 'react-native'
import { Text, Button, TextInput } from 'react-native-paper'
import _find from 'lodash/find'
import { MaterialIcons } from '@expo/vector-icons'

const FilterBox = ({
  partNumberClasses,
  onChangeFilter,
  onClose,
  defaultValues,
}) => {
  const [partNumberClass, setPartNumberClass] = useState(
    defaultValues.partNumberClassId
  )
  const [searchTerm, setSearchTerm] = useState(defaultValues.searchTerm)

  const onSelectPartNumberClass = (value) => {
    setPartNumberClass(value)
  }

  const onSubmitFilter = () => {
    onClose()
    onChangeFilter(partNumberClass, searchTerm)
  }
  return (
    <View style={styles.modalWrapper}>
      <View style={styles.content}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
          Filter By:
        </Text>

        <TextInput
          mode='outlined'
          style={{
            backgroundColor: '#FFF',
            marginVertical: 10,
            paddingVertical: 0,
          }}
          label='Search value'
          value={searchTerm}
          onChangeText={(e) => {
            setSearchTerm(e)
          }}
        />

        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
          Part Number Class
        </Text>
        <View style={styles.pickerWrapper}>
          <Picker
            onValueChange={onSelectPartNumberClass}
            collapsable={false}
            mode='dropdown'
            selectedValue={partNumberClass}
          >
            <Picker.Item label={'-- --'} value={''} />
            {partNumberClasses.map((item, i) => (
              <Picker.Item
                label={item.description}
                value={item.id}
                key={item.id}
              />
            ))}
          </Picker>
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
})

export default FilterBox
