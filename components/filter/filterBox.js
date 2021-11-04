import React, { useState } from 'react'
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import { Text, Appbar, TextInput, Button } from 'react-native-paper'
import { MultiPicker } from 'components'
import { MaterialIcons } from '@expo/vector-icons'

// list shape {propertyName: selectedItems, arrayData, label, property}[]
const FilterBox = ({ list, onUpdateFilter, searchTerm }) => {
  const [filterModal, setFilterModal] = useState(false)
  const [searchValue, setSearchValue] = useState(searchTerm || '')
  const arrayState = list.map((item, index) => {
    return useState(item.selectedItems)
  })

  const onChangeSearchValue = (value) => {
    setSearchValue(value)
  }

  const onCloseFilter = () => {
    setFilterModal(false)
  }

  const onOpenFilter = () => {
    setFilterModal(true)
  }

  const onSubmitFilter = () => {
    let stateObject = {}
    list.forEach((item, index) => {
      const [state] = arrayState[index]
      stateObject[item.propertyName] = state
    })
    onCloseFilter()
    onUpdateFilter({ searchTerm: searchValue, ...stateObject })
  }

  return (
    <>
      <View>
        <Appbar.Action color={'#FFF'} icon='filter' onPress={onOpenFilter} />
      </View>

      <Modal visible={filterModal} transparent animationType='fade'>
        <View style={styles.modalWrapper}>
          <View style={styles.content}>
            <Text
              style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}
            >
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
              value={searchValue}
              onChangeText={onChangeSearchValue}
            />

            {list.map((item, index) => {
              const [state, setState] = arrayState[index]
              const onsSelectState = (value) => {
                setState(value)
              }
              return (
                <MultiPicker
                  key={index}
                  style={{ marginBottom: 10 }}
                  label={item.label}
                  selectedItems={state}
                  onSelectedItemsChange={onsSelectState}
                  options={item.arrayData.map((e, i) => {
                    return { name: e[item.property], id: e.id }
                  })}
                />
              )
            })}

            <Button
              style={{ ...styles.button, marginTop: 12 }}
              mode='contained'
              onPress={onSubmitFilter}
            >
              Filter
            </Button>

            <TouchableOpacity style={styles.closeIcon} onPress={onCloseFilter}>
              <MaterialIcons name='close' size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
