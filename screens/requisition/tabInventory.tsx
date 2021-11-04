import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { Title, Text } from 'react-native-paper'

import { getRequisitionInventoryAPI } from '../../services/helpers/apis/requisition'
import { GlobalContext } from '../../Main'
import Loader from '../../components/loader'
import Inventory from '../../components/inventory'

interface TabInventoryProps {
  uuid: string
}

const TabInventory = ({ uuid }: TabInventoryProps) => {
  const [inventories, setInventories] = useState(null)
  const context = useContext(GlobalContext)

  useEffect(() => {
    const getRequisitionInventory = async () => {
      try {
        const res = await getRequisitionInventoryAPI(uuid)
        setInventories(res.data.data)
        console.log(res.data.data)
      } catch (e) {
        context.onApiError(e)
      }
    }

    getRequisitionInventory()
  }, [])

  return inventories ? (
    <ScrollView style={styles.container}>
      <Title>Inventory</Title>
      {inventories.length > 0 ? (
        inventories.map((inventory, i) => (
          <Inventory inventory={inventory} key={i} />
        ))
      ) : (
        <Text>No inventory found</Text>
      )}
    </ScrollView>
  ) : (
    <Loader />
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
})

export default TabInventory
