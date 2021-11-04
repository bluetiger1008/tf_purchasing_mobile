import React, { useEffect, useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import ShipmentContentsTab from './contents'
import ShipmentsTrackingTab from './tracking'
import ShipmentsOverViewTab from './overview'

import Loader from '../../../components/loader'
import { Appbar } from 'react-native-paper'
import { readShipmentByTrackingNumberAPI } from '../../../services/helpers/apis/shipment'
import { HeaderLinkTree } from 'components'

const Tab = createMaterialTopTabNavigator()

const ShipmentView = (props) => {
  const { navigation, route } = props
  const { trackingNumber } = route.params
  const [shipmentData, setShipmentData] = useState()

  const fetchData = async () => {
    try {
      const res = await readShipmentByTrackingNumberAPI(trackingNumber)
      setShipmentData(res.data.data)
    } catch (error) {
      console.log('Shipment Tracking number Error', error)
    }
  }
  
  useEffect(() => {
    fetchData()
  }, [])

  const headerName = shipmentData ? shipmentData.tracking_number : ''

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <HeaderLinkTree links={['Shipments', headerName]} />
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>

      {!shipmentData ? (
        <Loader />
      ) : (
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: { fontSize: 12 },
            tabBarStyle: { backgroundColor: '#FFF' },
          }}
        >
          <Tab.Screen
            name='ShipmentOverview'
            options={{ tabBarLabel: 'Overview' }}
          >
            {(props) => {
              return (
                <ShipmentsOverViewTab {...props} shipmentData={shipmentData} />
              )
            }}
          </Tab.Screen>
          <Tab.Screen
            name='ShipmentTracking'
            options={{ tabBarLabel: 'Tracking' }}
          >
            {(props) => {
              return (
                <ShipmentsTrackingTab {...props} shipmentData={shipmentData} />
              )
            }}
          </Tab.Screen>
          <Tab.Screen
            name='ShipmentContents'
            options={{ tabBarLabel: 'Contents' }}
          >
            {(props) => {
              return (
                <ShipmentContentsTab {...props} shipmentData={shipmentData} />
              )
            }}
          </Tab.Screen>
        </Tab.Navigator>
      )}
    </>
  )
}

export default ShipmentView
