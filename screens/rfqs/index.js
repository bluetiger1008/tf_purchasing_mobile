import React from 'react'

import RfqList from './list'
import RfqView from './view'

import { createStackNavigator } from '@react-navigation/stack'
import RfqListContextProvider from './context/provider'

const Stack = createStackNavigator()

const RpqScreen = ({ navigation }) => {
  return (
    <RfqListContextProvider>
      <Stack.Navigator initialRouteName='RfqList' headerMode={'none'}>
        <Stack.Screen name='RfqList' component={RfqList} />
        <Stack.Screen name='RfqView' component={RfqView} />
      </Stack.Navigator>
    </RfqListContextProvider>
  )
}

export default RpqScreen
