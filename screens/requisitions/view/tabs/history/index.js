import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { Title } from 'react-native-paper'

import { getRequisitionHistoryAPI } from 'services/helpers/apis/requisition'
import PurchaseOrderHistory from 'components/purchaseOrderHistory'

const History = ({ uuid }) => {
  const [historyData, setHistoryData] = useState(null)

  useEffect(() => {
    const getRequisitionHistory = async () => {
      try {
        const res = await getRequisitionHistoryAPI(uuid)

        setHistoryData(res.data.data.history)
      } catch (e) {
        // this.props.onApiError(e)
      }
    }

    getRequisitionHistory()
  }, [])

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <Title>History</Title>
      {historyData && <PurchaseOrderHistory historyData={historyData} />}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
})

export default History
