import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Appbar, Text, Button } from 'react-native-paper'
import Loader from 'components/loader'
import { readSupplierAPI } from 'services/helpers/apis/supplier'
import AccordionItem from 'components/accordionItem'

import SupplierProfileForm from '../components/supplierProfileForm'
import AssociatedUserProfileForm from '../components/associatedUserProfileForm'
import PaymentForm from '../components/paymentForm'
import SettingsForm from '../components/settingsForm'
import { HeaderLinkTree } from 'components'

const SupplierView = ({ navigation, route }) => {
  const { uuid, name } = route.params
  const [supplierData, setSupplierData] = useState(null)
  const supplierProfileState = useState(true)
  const associatedUserProfileState = useState(true)
  const paymentState = useState(true)
  const settingsState = useState(true)
  const documentsState = useState(true)

  useEffect(() => {
    ;(async () => {
      const res = await readSupplierAPI(uuid)
      setSupplierData(res.data.data)
    })()
  }, [])

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <HeaderLinkTree links={['Settings', 'Suppliers', name]} />
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>
      <View style={styles.content}>
        {!supplierData ? (
          <View style={styles.content}>
            <Loader />
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ width: '100%', padding: 20 }}>
            <AccordionItem
              style={styles.accordion}
              title='Supplier Profile'
              showState={supplierProfileState}
            >
              <SupplierProfileForm
                initialValues={supplierData.profile}
                uuid={uuid}
              />
            </AccordionItem>
            <AccordionItem
              style={styles.accordion}
              title='Associated User Profile'
              showState={associatedUserProfileState}
            >
              <AssociatedUserProfileForm
                linkedUser={supplierData.linked_user}
                uuid={uuid}
                navigation={navigation}
              />
            </AccordionItem>
            <AccordionItem
              style={styles.accordion}
              title='Payment'
              showState={paymentState}
            >
              <PaymentForm payment={supplierData.payment} uuid={uuid} />
            </AccordionItem>
            <AccordionItem
              style={styles.accordion}
              title='Settings'
              showState={settingsState}
            >
              <SettingsForm uuid={uuid} />
            </AccordionItem>
            <AccordionItem
              style={styles.accordion}
              title='Documents'
              showState={documentsState}
            ></AccordionItem>
          </ScrollView>
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
  },
  accordion: {
    marginBottom: 10,
  },
})

export default SupplierView
