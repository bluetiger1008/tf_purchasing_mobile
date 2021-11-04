import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Appbar,
  BottomNavigation,
  Headline,
  Subheading,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper'
import { RouteProp } from '@react-navigation/native'

import Pricing from './pricing'
import History from './history'
import TabInventory from './tabInventory'
import RfqPo from './rfqPo'
import Shipments from './shipments'
import { readRequisitionAPI } from '../../services/helpers/apis/requisition'
import { formatFloat } from '../../utils/common'

type RootStackParamList = {
  Requisition: {
    params: {
      requisition: object
    }
  }
}

type RequisitionScreenProp = RouteProp<RootStackParamList, 'Requisition'>

interface Props {
  navigation: any
  route: RequisitionScreenProp
}

const Requisition = ({ navigation, route }: Props) => {
  const { params } = route
  const { requisition } = params
  const [index, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'pricing', title: 'Pricing', icon: 'currency-usd' },
    { key: 'inventory', title: 'Inventory', icon: 'format-list-bulleted' },
    { key: 'rfq_po', title: 'Rfq/Po', icon: 'cart' },
    { key: 'shipments', title: 'Shipments', icon: 'truck' },
    { key: 'history', title: 'History', icon: 'history' },
  ])
  const [requisitionData, setRequisitionData] = useState(null)
  const [historicalAverage, setHistoricalAverage] = useState(null)

  const onSetHistoricalAverage = (value) => {
    console.log('value', value)
    setHistoricalAverage(value)
  }

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'pricing':
        return (
          <Pricing
            uuid={requisition.uuid}
            onSetHistoricalAverage={onSetHistoricalAverage}
          />
        )
      case 'inventory':
        return <TabInventory uuid={requisition.uuid} />
      case 'rfq_po':
        return <RfqPo />
      case 'shipments':
        return <Shipments />
      case 'history':
        return <History uuid={requisition.uuid} />
      default:
        break
    }
  }

  useEffect(() => {
    const fetchApis = async () => {
      try {
        const res = await readRequisitionAPI(requisition.uuid)
        setRequisitionData(res.data.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchApis()
  }, [])

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack()
          }}
        />

        <Appbar.Content title='Requisition' subtitle='' />
      </Appbar.Header>
      {requisitionData && (
        <View style={styles.container}>
          <Headline>Requisition ID: {requisition.order_id}</Headline>
          <View>
            <Card style={styles.card}>
              <Card.Content>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ width: '50%' }}>
                    <Title>Part Number</Title>
                    {requisitionData.requisition.part_numbers.map(
                      (number, i) => (
                        <Paragraph key={i}>{number}</Paragraph>
                      )
                    )}
                  </View>
                  <View style={{ width: '50%' }}>
                    <Title>Pricing</Title>
                    <View style={{ marginBottom: 20 }}>
                      <Title>
                        ${formatFloat(requisitionData.requisition.high_target)}
                      </Title>
                      <Paragraph>High Target</Paragraph>
                    </View>

                    {historicalAverage && (
                      <View>
                        <Title>${formatFloat(historicalAverage)}</Title>
                        <Paragraph>Historical Average</Paragraph>
                      </View>
                    )}
                  </View>
                </View>
              </Card.Content>
            </Card>
          </View>
        </View>
      )}

      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    marginTop: 20,
  },
})

export default Requisition
