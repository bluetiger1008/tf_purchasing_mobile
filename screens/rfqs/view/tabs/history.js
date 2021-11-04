import React, { useEffect, useState, useContext } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { getRfqHistoryAPI } from 'services/helpers/apis/rfq'
import PurchaseOrderHistory from 'components/purchaseOrderHistory'
import { GlobalContext } from '../../../../Main'

const History = ({ uuid }) => {
  const [historyData, setHistoryData] = useState(null)
  const context = useContext(GlobalContext)

  useEffect(() => {
    const getRfqHistory = async () => {
      try {
        const res = await getRfqHistoryAPI(uuid)

        setHistoryData(res.data.data.history)
      } catch (e) {
        context.onApiError(e)
      }
    }

    getRfqHistory()
  }, [])
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
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
