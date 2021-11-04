import React from 'react'
import { ScrollView } from 'react-native'
import { Appbar } from 'react-native-paper'
import SupplierProfileForm from '../components/supplierProfileForm'

const SuppliersCreate = ({ navigation }) => {
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title='Supplier Profile' subtitle='' />
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>
      <ScrollView
        style={{ flex: 1, width: '100%', backgroundColor: '#FFF' }}
        contentContainerStyle={{ padding: 10 }}
      >
        <SupplierProfileForm
          onSuccessAdd={(uuid) => navigation.replace('SupplierView', { uuid })}
        />
      </ScrollView>
    </>
  )
}

export default SuppliersCreate
