import React, { useState, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import {
  Appbar,
  BottomNavigation,
  Headline,
  Card,
  Title,
  Paragraph,
  Text,
} from 'react-native-paper'

import Pricing from './tabs/pricing'
import History from './tabs/history'
import TabInventory from './tabs/inventory'
import RfqPo from './tabs/rfqPo'
import Shipments from './tabs/shipments'
import { readRequisitionAPI } from 'services/helpers/apis/requisition'
import requisitionActions from 'services/redux/requisition/actions'
import { formatFloat } from 'utils/common'
import { ShowControl } from 'components'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { HeaderLinkTree } from 'components'

const { setSelectedRequisition } = requisitionActions

const RequisitionView = ({ navigation, route, setSelectedRequisition }) => {
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
  const [isMinimized, setIsMinimized] = useState(false)

  const onSetHistoricalAverage = (value) => {
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
        return <RfqPo uuid={requisition.uuid} />
      case 'shipments':
        return <Shipments uuid={requisition.uuid} />
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

  useEffect(() => {
    if (requisitionData) {
      setSelectedRequisition(requisitionData)
    }
  }, [requisitionData])

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => {
            navigation.goBack()
          }}
        />

        <HeaderLinkTree links={['Settings', requisition.order_id]} />

        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>
      {requisitionData && (
        <View style={styles.container}>
          <ShowControl visible={isMinimized}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                Requisition ID: {requisition.order_id}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsMinimized(false)
                }}
                style={styles.min}
              >
                <Text
                  style={{ color: 'blue', textDecorationLine: 'underline' }}
                >
                  Show Info
                </Text>
              </TouchableOpacity>
            </View>
          </ShowControl>
          <ShowControl visible={!isMinimized}>
            <View>
              <Headline>Requisition ID: {requisition.order_id}</Headline>
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
                          $
                          {formatFloat(requisitionData.requisition.high_target)}
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
            <TouchableOpacity
              onPress={() => {
                setIsMinimized(true)
              }}
              style={styles.min}
            >
              <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
                Hide info
              </Text>
            </TouchableOpacity>
          </ShowControl>
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
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  card: {
    marginTop: 20,
  },
  min: {
    padding: 2,
    alignItems: 'center',
    flexShrink: 1,
    width: 'auto',
  },
})

const mapStateToProps = (state) => ({
  priceHistory: state.requisition.priceHistory,
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setSelectedRequisition,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(RequisitionView)
