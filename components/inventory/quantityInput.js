import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Button } from 'react-native-paper'
import { ShowControl } from 'components'

const QuantityInput = ({ line, onClose, onChangeQuantity }) => {
  const { quantity_required, quantity_available } = line
  const [quantity, setQuantity] = useState(quantity_required.toString())
  const [error, setError] = useState(false)
  let maximumValue = line.quantity_available

  const handleChangeQuantity = (value) => {
    setQuantity(value)
  }

  const onUpdate = () => {
    if (parseInt(quantity, 10) > maximumValue || parseInt(quantity, 10) <= 0) {
      setError(true)
    } else {
      setError(false)
      onChangeQuantity({ ...line, quantity_required: quantity })
      onClose()
    }
  }

  const increment = () => {
    let value = parseInt(quantity)
    if (value < maximumValue) {
      let result = value + 1
      setQuantity(result.toString())
    }
  }

  const decrement = () => {
    let value = parseInt(quantity)

    if (value > 0) {
      let result = value - 1
      setQuantity(result.toString())
    }
  }

  return (
    <View style={styles.modal_wrapper}>
      <View style={styles.content}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Enter Quantity</Text>
        <View style={styles.row}>
          <TouchableOpacity onPress={decrement}>
            <MaterialIcons name='remove-circle-outline' color='red' size={30} />
          </TouchableOpacity>

          <TextInput
            keyboardType='numeric'
            style={{
              flexShrink: 1,
              textAlign: 'center',
              fontSize: 18,
              height: 40,
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderBottomColor: 'gray',
            }}
            value={quantity}
            onChangeText={handleChangeQuantity}
          />
          <TouchableOpacity onPress={increment}>
            <MaterialIcons name='add-circle-outline' size={30} />
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 13 }}>
          Available Quantity: {quantity_available}
        </Text>

        <ShowControl visible={error}>
          <Text style={{ color: 'red' }}>
            Must be lest than available quantity
          </Text>
        </ShowControl>
        <Button style={styles.button} mode='contained' onPress={onUpdate}>
          Update
        </Button>
        <TouchableOpacity
          style={{ position: 'absolute', top: 10, right: 10 }}
          onPress={onClose}
        >
          <MaterialIcons name='close' size={20} color='gray' />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 7,
  },
  modal_wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: '#0000004D',
  },
  content: {
    width: '90%',
    maxHeight: Dimensions.get('window').height * 0.6,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'blue',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 10,
    paddingVertical: 15,
  },
})

export default QuantityInput
