import React from 'react'
import { View } from 'react-native'
import { Subheading, ListItem, Title } from 'react-native-paper'

import InventoryTable from './inventoryTable'

type InventoryProps = {
  inventory: object
}

const Inventory = ({ inventory }: InventoryProps) => {
  console.log(inventory)

  return (
    <View>
      <Title>{inventory.supplier.name}</Title>
      <InventoryTable data={inventory.lines} />
    </View>
  )
}

export default Inventory
