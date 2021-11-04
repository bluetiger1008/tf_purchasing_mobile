import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Appbar, Card, Text } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'

const SettingsSelection = (props) => {
  const { navigation } = props

  const selection = [
    { name: 'Users', routeName: 'UserList' },
    { name: 'Suppliers', routeName: 'SupplierList' },
    {
      name: 'Supplier Part Number Rules',
      routeName: 'SupplierPartNumberRulesList',
    },
    {
      name: 'Supplier Preference Rules',
      routeName: 'SupplierPreferenceRulesList',
    },
    { name: 'Supplier Name Variants', routeName: 'SupplierNameVariants' },
    {
      name: 'Manufacturer Name Variants',
      routeName: 'ManufacturerNameVariants',
    },
  ]

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title='Settings' subtitle='' />
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>
      <View style={styles.content}>
        {selection.map((item, index) => {
          const { name, routeName } = item
          return (
            <Card
              key={index}
              style={styles.item}
              onPress={() => navigation.navigate(routeName)}
            >
              <Card.Content style={styles.item_content}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{name}</Text>
                <MaterialIcons name='chevron-right' size={25} color='gray' />
              </Card.Content>
            </Card>
          )
        })}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
    padding: 20,
  },
  item: {
    borderRadius: 8,
    marginVertical: 5,
  },
  item_content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
})

export default SettingsSelection
