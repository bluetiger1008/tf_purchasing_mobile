import React, { useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Text, Button, TextInput } from 'react-native-paper'
import _find from 'lodash/find'
import { MaterialIcons } from '@expo/vector-icons'
import { MultiPicker } from 'components'

const FilterBox = ({
  statusList,
  userList,
  onChangeFilter,
  onClose,
  defaultValues,
}) => {
  const [statuses, setStatuses] = useState(defaultValues.statuses)
  const [users, setUsers] = useState(defaultValues.users)
  const [searchTerm, setSearchTerm] = useState(defaultValues.searchTerm)

  const onSelectStatuses = (value) => {
    setStatuses(value)
  }

  const onSelectUsers = (value) => {
    setUsers(value)
  }

  const onSubmitFilter = () => {
    onClose()
    onChangeFilter(statuses, users, searchTerm)
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

        <MultiPicker
          style={{ marginBottom: 10 }}
          label={'Assignee'}
          selectedItems={users}
          onSelectedItemsChange={onSelectUsers}
          options={userList.map((e, i) => {
            return { name: e.name, id: e.id }
          })}
        />

        <MultiPicker
          style={{ marginBottom: 10 }}
          label={'Status'}
          selectedItems={statuses}
          onSelectedItemsChange={onSelectStatuses}
          options={statusList.map((e, i) => {
            return { name: e.status, id: e.id }
          })}
        />

        <Button
          style={{ ...styles.button, marginTop: 12 }}
          mode='contained'
          onPress={onSubmitFilter}
        >
          Filter
        </Button>

        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
          <MaterialIcons name='close' size={20} />
        </TouchableOpacity>
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
