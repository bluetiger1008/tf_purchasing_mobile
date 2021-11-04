import React, { useEffect } from 'react'

import SupplierList from './list'
import SupplierView from './view'
import SupplierEditContact from './edit/contact'
import SupplierCreate from './create'
import adminActions from 'services/redux/admin/actions'
import { useDispatch } from 'react-redux'

import { createStackNavigator } from '@react-navigation/stack'

const { fetchUserList } = adminActions
const Stack = createStackNavigator()

const SupplierScreen = ({ navigation }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchUserList())
  }, [])
  return (
    <Stack.Navigator initialRouteName='SuppliersList' headerMode={'none'}>
      <Stack.Screen name='SupplierList' component={SupplierList} />
      <Stack.Screen name='SupplierView' component={SupplierView} />
      <Stack.Screen
        name='SupplierEditContact'
        component={SupplierEditContact}
      />
      <Stack.Screen name='SupplierCreate' component={SupplierCreate} />
    </Stack.Navigator>
  )
}

export default SupplierScreen
