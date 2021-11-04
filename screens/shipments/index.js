import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import ShipmentList from './list'
import ShipmentView from './view'

const Stack = createStackNavigator()

const ShipmentScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='ShipmentList' component={ShipmentList} />
      <Stack.Screen name='ShipmentView' component={ShipmentView} />
    </Stack.Navigator>
  )
}

export default ShipmentScreen
