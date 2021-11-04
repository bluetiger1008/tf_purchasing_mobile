import React from 'react'
import { StyleSheet } from 'react-native'

import SettingsSelection from './selection'
import UserEdit from './user/edit'
import UserList from './user/list'

import SupplierList from './suppliers/list'
import SupplierView from './suppliers/view'
import SupplierCreate from './suppliers/create'
import SupplierEditContact from './suppliers/edit/contact'

import SupplierPartNumberRulesList from './supplierPartNumberRules/list'
import SupplierPartNumberRulesEdit from './supplierPartNumberRules/edit'

import SupplierNameVariants from './nameVariants/supplier/list'

import SupplierPreferenceRulesList from './supplierPreferenceRules/list'
import SupplierPreferenceRulesEdit from './supplierPreferenceRules/edit'
import ManufacturerNameVariants from './nameVariants/manufacturer/list'

import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

const SettingsScreen = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName='SettingsSelection' headerMode={'none'}>
      <Stack.Screen name='SettingsSelection' component={SettingsSelection} />
      {/* <Stack.Screen name='User' component={User} /> */}

      {/* Suppliers */}
      <Stack.Screen name='SupplierList' component={SupplierList} />
      <Stack.Screen name='SupplierView' component={SupplierView} />
      <Stack.Screen
        name='SupplierEditContact'
        component={SupplierEditContact}
      />
      <Stack.Screen name='SupplierCreate' component={SupplierCreate} />

      <Stack.Screen name='UserList' component={UserList} />
      <Stack.Screen name='UserEdit' component={UserEdit} />

      <Stack.Screen
        name='SupplierPartNumberRulesList'
        component={SupplierPartNumberRulesList}
      />
      <Stack.Screen
        name='SupplierPartNumberRulesEdit'
        component={SupplierPartNumberRulesEdit}
      />

      <Stack.Screen
        name='SupplierPreferenceRulesList'
        component={SupplierPreferenceRulesList}
      />
      <Stack.Screen
        name='SupplierPreferenceRulesEdit'
        component={SupplierPreferenceRulesEdit}
      />

      {/* <Stack.Screen
        name='SupplierPartNumberRules'
        component={SupplierPartNumberRules}
      /> */}
      {/* <Stack.Screen
        name='SupplierPreferenceRules'
        component={SupplierPreferenceRules}
      /> */}
      <Stack.Screen
        name='SupplierNameVariants'
        component={SupplierNameVariants}
      />
      <Stack.Screen
        name='ManufacturerNameVariants'
        component={ManufacturerNameVariants}
      />
    </Stack.Navigator>
  )
}

export default SettingsScreen
