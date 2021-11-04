import React from 'react'

import RequisitionList from './list'
import RequisitionView from './view'

import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

const RequisitionScreen = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName='RequisitionList' headerMode={'none'}>
      <Stack.Screen name='RequisitionList' component={RequisitionList} />
      <Stack.Screen name='RequisitionView' component={RequisitionView} />
    </Stack.Navigator>
  )
}

export default RequisitionScreen
