import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { Title, Text } from 'react-native-paper'

import { getRequisitionInventoryAPI } from 'services/helpers/apis/requisition'
import { GlobalContext } from '../../../../../Main'
import Loader from 'components/loader'
import TableList from './tableList'

const InventoryTab = ({ uuid }) => {
  const [inventories, setInventories] = useState(null)
  const context = useContext(GlobalContext)

  useEffect(() => {
    const getRequisitionInventory = async () => {
      try {
        const res = await getRequisitionInventoryAPI(uuid)
        setInventories(res.data.data)
      } catch (e) {
        context.onApiError(e)
      }
    }

    getRequisitionInventory()
  }, [])

  return inventories ? (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Title>Inventory</Title>
      {inventories.length > 0 ? (
        inventories.map((inventory, i) => (
          <TableList inventory={inventory} key={i} />
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

export default InventoryTab
