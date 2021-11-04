import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Title, Button, Subheading, P } from 'react-native-paper'

import InventoryTable from './inventoryTable'

const Inventory = ({ inventory }) => {
  return (
    <View>
      <View style={styles.row}>
        <View>
          <Title>{inventory.supplier.name}</Title>
          <Subheading>Total: 0</Subheading>
        </View>

        <Button
          disabled
          style={{ ...styles.button, marginTop: 12, width: 'auto' }}
          mode='contained'
          onPress={() => {}}
        >
          Add to RFQ {'>'}
        </Button>
      </View>

      <InventoryTable data={inventory.lines} />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    marginVertical: 7,
  },
})

export default Inventory
