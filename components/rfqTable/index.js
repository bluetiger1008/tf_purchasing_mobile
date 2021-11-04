import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet, Modal } from 'react-native'
import { Card, Text } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import SupplierInfo from './supplierInfo'

const RfqTable = ({ lines }) => {
  const [viewSupplier, setViewSupplier] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)

  const onSelectSupplier = (supplier) => {
    setViewSupplier(true)
    setSelectedSupplier(supplier)
  }

  return (
    <View>
      {lines.map((row, i) => {
        return (
          <Card key={row.id} style={styles.card}>
            <Card.Content>
              <View style={styles.row_space}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    textDecorationLine: 'underline',
                  }}
                >
                  PO {row.id}
                </Text>
                <View style={styles.tag}>
                  <Text
                    style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}
                  >
                    {row.status.term.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={{ color: 'gray', fontSize: 12 }}>
                {row.date.formatted_date}
              </Text>

              <TouchableOpacity onPress={() => onSelectSupplier(row.supplier)}>
                <View style={styles.supplier}>
                  <MaterialIcons
                    name='preview'
                    size={20}
                    color={'gray'}
                    style={{ marginRight: 2 }}
                  />
                  <Text>{row.supplier.profile.name}</Text>
                </View>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        )
      })}
      <Modal
        visible={viewSupplier}
        transparent
        animationType='fade'
        onDismiss={() => setSelectedSupplier(null)}
      >
        <SupplierInfo
          supplier={selectedSupplier}
          onClose={() => setViewSupplier(false)}
        />
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  tag: {
    padding: 2.5,
    paddingHorizontal: 8,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  row_space: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  supplier: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    paddingLeft: 0,
  },
  card: {
    marginBottom: 8,
  },
})

export default RfqTable
