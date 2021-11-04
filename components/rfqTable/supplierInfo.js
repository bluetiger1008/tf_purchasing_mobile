import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'

const SupplierInfo = ({ supplier, onClose }) => {
  return (
    <View style={styles.modal_wrapper}>
      <View style={styles.content}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
          Supplier Details
        </Text>
        <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 2 }}>
          {supplier.profile.name}
        </Text>
        <Text style={{ fontSize: 15 }}>
          Name: {supplier.linked_user.first_name}{' '}
          {supplier.linked_user.last_name}
        </Text>
        <Text style={{ fontSize: 15 }}>
          Address: {supplier.profile.city}, {supplier.profile.state}
        </Text>
        <Text>Email: {supplier.linked_user.email}</Text>
        <Text>Phone: {supplier.linked_user.phone}</Text>

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
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  user_item: {
    paddingVertical: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    backgroundColor: '#FFF',
  },
})

export default SupplierInfo
