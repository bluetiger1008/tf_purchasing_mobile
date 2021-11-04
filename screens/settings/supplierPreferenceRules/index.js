import React from 'react'

import SupplierPreferenceRulesList from './list'
import SupplierPreferenceRulesEdit from './edit'

import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

const SupplierPreferenceRulesScreen = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName='SupplierPreferenceRulesList'
      headerMode={'none'}
    >
      <Stack.Screen
        name='SupplierPreferenceRulesList'
        component={SupplierPreferenceRulesList}
      />
      <Stack.Screen
        name='SupplierPreferenceRulesEdit'
        component={SupplierPreferenceRulesEdit}
      />
    </Stack.Navigator>
  )
}

export default SupplierPreferenceRulesScreen
