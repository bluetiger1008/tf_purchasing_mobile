import React, { useEffect, useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import LineItemsTab from './lineItems'
import CorrespondenceTab from './correspondence'
import QuoteTab from './quote'
import HistoryTab from './history'

import Loader from 'components/loader'
import { Appbar } from 'react-native-paper'
// import { readShipmentByTrackingNumberAPI } from '../../../services/helpers/apis/shipment'

const Tab = createMaterialTopTabNavigator()

const RfqViewTabs = (props) => {
  const { navigation, route, selectedRfq } = props
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
          tabBarItemStyle: { width: 'auto' },

          tabBarStyle: {
            backgroundColor: '#FFF',
            borderTopColor: '#ededed',
            borderTopWidth: 0.5,
          },
        }}
      >
        <Tab.Screen name='LineItemsTab' options={{ tabBarLabel: 'LINE ITEMS' }}>
          {(props) => {
            return (
              <LineItemsTab
                {...props}
                selectedRfq={selectedRfq}
                navigation={navigation}
              />
            )
          }}
        </Tab.Screen>
        <Tab.Screen
          name='CorrespondenceTab'
          options={{ tabBarLabel: 'CORRESPONDENCE' }}
        >
          {(props) => {
            return (
              <CorrespondenceTab
                {...props}
                selectedRfq={selectedRfq}
                navigation={navigation}
              />
            )
          }}
        </Tab.Screen>
        <Tab.Screen name='QuoteTab' options={{ tabBarLabel: 'QUOTE' }}>
          {(props) => {
            return <QuoteTab {...props} selectedRfq={selectedRfq}
              navigation={navigation} />
          }}
        </Tab.Screen>
        <Tab.Screen name='HistoryTab' options={{ tabBarLabel: 'HISTORY' }}>
          {(props) => {
            return <HistoryTab {...props} uuid={selectedRfq.uuid} />
          }}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  )
}

export default RfqViewTabs
