import React from 'react'

import PoList from './list'
import PoView from './view'

import { createStackNavigator } from '@react-navigation/stack'
import PoListContextProvider from './context/provider'

const Stack = createStackNavigator()

const PoScreen = ({ navigation }) => {
  return (
    <PoListContextProvider>
      <Stack.Navigator initialRouteName='PoList' headerMode={'none'}>
        <Stack.Screen name='PoList' component={PoList} />
        <Stack.Screen name='PoView' component={PoView} />
      </Stack.Navigator>
    </PoListContextProvider>
  )
}

export default PoScreen
