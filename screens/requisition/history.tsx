import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Title } from 'react-native-paper'

import { getRequisitionHistoryAPI } from '../../services/helpers/apis/requisition'
import PurchaseOrderHistory from '../../components/purchaseOrderHistory'

interface HistoryProps {
  uuid: string
}

const History = ({ uuid }: HistoryProps) => {
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
    <View style={styles.container}>
      <Title>History</Title>
      {historyData && <PurchaseOrderHistory historyData={historyData} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
})

export default History
