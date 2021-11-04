import React, { useEffect } from 'react'

import SupplierPartNumberRulesList from './list'
import SupplierPartNumberRulesEdit from './edit'
import adminActions from 'services/redux/admin/actions'
import { useDispatch } from 'react-redux'

import { createStackNavigator } from '@react-navigation/stack'

const { fetchUserList } = adminActions
const Stack = createStackNavigator()

const SupplierPartNumberRulesScreen = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName='SupplierPartNumberRulesList'
      headerMode={'none'}
    >
      <Stack.Screen
        name='SupplierPartNumberRulesList'
        component={SupplierPartNumberRulesList}
      />
      <Stack.Screen
        name='SupplierPartNumberRulesEdit'
        component={SupplierPartNumberRulesEdit}
      />
    </Stack.Navigator>
  )
}

export default SupplierPartNumberRulesScreen
