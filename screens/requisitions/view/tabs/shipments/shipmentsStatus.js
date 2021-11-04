import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Card, Divider } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import ItemRow from './itemRow'

const ShipmentsStatus = ({ shipments }) => {
  return (
    <View>
      {shipments.length > 0 ? (
        <>
          {shipments.map((shipmentItem, index) => {
            const { tracking_number, service, activity } = shipmentItem
            const initialActivity = activity[0]

            return (
              <Card key={index}>
                <Card.Content>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View>
                      <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                        {service.description}
                      </Text>
                      <Text
                        style={{
                          color: 'blue',
                          textDecorationLine: 'underline',
                          fontSize: 16,
                        }}
                      >
                        {tracking_number}
                      </Text>
                    </View>
                    <View
                      style={{
                        ...styles.status_wrap,
                        backgroundColor: `#${initialActivity.color}`,
                      }}
                    >
                      <MaterialIcons
                        name={initialActivity.icon.replace('_', '-')}
                        size={15}
                        color={'#FFF'}
                        style={{ marginRight: 5 }}
                      />
                      <Text style={{ color: '#FFF' }}>
                        {initialActivity.status}
                      </Text>
                    </View>
                  </View>

                  <Divider style={{ marginVertical: 10 }} />

                  {shipmentItem.lines.map((line, index) => {
                    return <ItemRow line={line} key={index} />
                  })}
                </Card.Content>
              </Card>
            )
          })}
        </>
      ) : (
        <Text> No shipments found </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  status_wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
})

export default ShipmentsStatus
