import React, { useState } from 'react'
import { StyleSheet, View, Picker } from 'react-native'
import { Text, Button, TextInput } from 'react-native-paper'
import _find from 'lodash/find'
import { MaterialIcons } from '@expo/vector-icons'
import { SinglePicker } from 'components'

const modeOptions = [
  {
    id: 0,
    value: 'all',
    label: 'All',
  },
  {
    id: 1,
    value: false,
    label: 'Inactive',
  },
  {
    id: 2,
    value: true,
    label: 'Active',
  },
]

const FilterBox = ({
  onChangeFilter,
  onClose,
  defaultValues,
  userTypeList,
}) => {
  // searchTerm, active, userType
  const [filterValues, setFilterValues] = useState({
    active: null,
    userType: 'all',
    searchTerm: '',
    ...defaultValues,
  })

  const onChangeField = (name, value) => {
    setFilterValues({ ...filterValues, [name]: value })
  }

  const onSubmitFilter = () => {
    onClose()
    onChangeFilter(filterValues)
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
          value={filterValues.searchTerm}
          onChangeText={(value) => {
            onChangeField('searchTerm', value)
          }}
        />

        <SinglePicker
          title='Active'
          style={{ marginBottom: 10 }}
          list={modeOptions}
          id='value'
          label='label'
          selectedValue={filterValues.active}
          onChangeValue={(value) => onChangeField('active', value.value)}
        />

        <SinglePicker
          title='User type'
          style={{ marginBottom: 10 }}
          list={userTypeList}
          id='value'
          label='label'
          selectedValue={filterValues.userType}
          onChangeValue={(value) => onChangeField('userType', value.value)}
        />

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
