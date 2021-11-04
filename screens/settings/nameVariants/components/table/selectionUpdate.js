import React from 'react'
import { View, StyleSheet, Picker } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import { ShowControl } from 'components'
import _find from 'lodash/find'

const SelectionUpdate = ({ list, onUpdateSelected, onClose, tableType }) => {
  const [selectedValue, setSelectedValue] = React.useState('')
  const listName = tableType == 'supplier' ? 'Supplier' : 'Manufacturer'
  const handleChange = (value) => {
    setSelectedValue(value)
  }

  return (
    <View style={styles.modalWrapper}>
      <View style={styles.content}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
          Update Selected Items
        </Text>

        <Text style={{ fontSize: 14, color: 'gray' }}>{listName}</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            onValueChange={handleChange}
            collapsable={true}
            selectedValue={selectedValue}
            style={{
              height: 40,
              width: '100%',
              fontSize: 8,
            }}
          >
            <Picker.Item label={'-- --'} value={''} />
            {list.map((item, i) => (
              <Picker.Item label={item.name} value={item.id} key={item.id} />
            ))}
          </Picker>
        </View>

        <ShowControl visible={!!selectedValue}>
          <Text style={{ fontSize: 14, color: 'red', fontWeight: 'bold' }}>
            *Note
          </Text>
          <Text style={{ fontSize: 14, fontStyle: 'italic', marginBottom: 20 }}>
            All items selected will be updated by the selected{' '}
            {listName.toLocaleLowerCase()}
          </Text>
        </ShowControl>

        <Button
          disabled={selectedValue == ''}
          mode='contained'
          onPress={() => onUpdateSelected(selectedValue)}
        >
          Update
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

export default SelectionUpdate
