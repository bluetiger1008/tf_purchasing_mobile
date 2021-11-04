import React, { useEffect, useState, useContext } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { Title, DataTable, Text } from 'react-native-paper'
import axios from 'axios'
import _isEqual from 'lodash/isEqual'

import { getRequisitionPriceHistoryAPI } from '../../services/helpers/apis/requisition'
import PurchaseHistoryTable from '../../components/purchaseHistoryTable'
import Loader from '../../components/loader'
import { GlobalContext } from '../../Main'

type PricingProps = {
  uuid: string
  onSetHistoricalAverage: Function
}

interface IpriceHistory {}

const Pricing = ({ uuid, onSetHistoricalAverage }: PricingProps) => {
  const [priceHistory, setPriceHistory] = useState<IpriceHistory | null>(null)

  const context = useContext(GlobalContext)

  useEffect(() => {
    const getRequisitionPriceHistory = async () => {
      try {
        const res = await getRequisitionPriceHistoryAPI(uuid)
        setPriceHistory(
          _isEqual(res.data.data.price_history, [])
            ? null
            : res.data.data.price_history
        )
        onSetHistoricalAverage(res.data.data.historical_average)
      } catch (e) {
        context.onApiError(e)
      }
    }

    getRequisitionPriceHistory()
  }, [])

  return !priceHistory ? (
    <Loader />
  ) : (
    <ScrollView style={styles.container}>
      <Title>Pricing</Title>
      {priceHistory !== [] ? (
        <PurchaseHistoryTable priceHistory={priceHistory} />
      ) : (
        <Text>No Purchase History Found</Text>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
})

export default Pricing
