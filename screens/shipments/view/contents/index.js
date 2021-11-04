import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Card } from 'react-native-paper'

const ShipmentContentsTab = (props) => {
  const { shipmentData } = props
  const { lines } = shipmentData

  const partNumbers = Object.keys(lines)

  const getLineTotal = (index) => {
    const entry_values_nester = partNumbers.map((v) =>
      lines[v].map((t, i) => t.shipped_quantity)
    )
    const entry_values = entry_values_nester.map((v) =>
      v.reduce((a, b) => a + b, 0)
    )
    return entry_values[index]
  }

  const getContentItemCount = () => {
    const entry_values_nester = partNumbers.map((v) =>
      lines[v].map((t, i) => t.shipped_quantity)
    )
    const entry_values = entry_values_nester.map((v) =>
      v.reduce((a, b) => a + b, 0)
    )
    const total = entry_values.reduce((a, b) => a + b, 0)
    return total
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={{ fontWeight: 'bold', paddingBottom: 10 }}>
        Total Pieces: {getContentItemCount()}
      </Text>
      {partNumbers.map((item, index) => {
        return (
          <Card key={index} style={styles.card}>
            <Card.Content>
              <Text
                style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 10 }}
              >
                {item}
              </Text>
              {lines[item].map((item, index, { length }) => {
                return (
                  <View key={index}>
                    <View>
                      <Text style={{ fontSize: 14 }}>
                        Purchase Order: PO {item.po_id}
                      </Text>
                      <Text style={{ fontSize: 14 }}>
                        Requisition number: {item.requisition.order_id}
                      </Text>
                      <Text style={{ fontSize: 14 }}>
                        Quantity: {item.shipped_quantity}
                      </Text>
                    </View>

                    {length != index + 1 && <View style={styles.divider} />}
                  </View>
                )
              })}
              <Text style={{ fontWeight: 'bold', paddingTop: 10 }}>
                Line Total: {getLineTotal(index)}
              </Text>
            </Card.Content>
          </Card>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    padding: 20,
  },
  card: {
    marginVertical: 5,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'gray',
    marginVertical: 10,
  },
})

export default ShipmentContentsTab
