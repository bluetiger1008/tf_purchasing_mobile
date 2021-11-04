import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import LineItemsTab from './lineItems'
import CorrespondenceTab from './correspondence'
import Shipments from './shipments'
import HistoryTab from './history'

const Tab = createMaterialTopTabNavigator()

const PoViewTabs = (props) => {
  const { navigation, route, selectedPo } = props
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
            paddingHorizontal: 10,
          },
          tabBarIndicatorContainerStyle: {
            paddingHorizontal: 10,
          },
          tabBarIndicatorStyle: {
            marginLeft: 10,
          },
        }}
      >
        <Tab.Screen name='LineItemsTab' options={{ tabBarLabel: 'LINE ITEMS' }}>
          {(props) => {
            return (
              <LineItemsTab
                {...props}
                selectedPo={selectedPo}
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
                selectedPo={selectedPo}
                navigation={navigation}
              />
            )
          }}
        </Tab.Screen>
        <Tab.Screen name='ShipmentsTab' options={{ tabBarLabel: 'Shipments' }}>
          {(props) => {
            return (
              <Shipments
                {...props}
                selectedPo={selectedPo}
                navigation={navigation}
              />
            )
          }}
        </Tab.Screen>
        <Tab.Screen name='HistoryTab' options={{ tabBarLabel: 'HISTORY' }}>
          {(props) => {
            return <HistoryTab {...props} uuid={selectedPo.uuid} />
          }}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  )
}

export default PoViewTabs
