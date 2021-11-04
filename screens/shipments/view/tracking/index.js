import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Card } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'

const ShipmentTrackingTab = (props) => {
  const { shipmentData } = props
  const { activity, delivery_summary } = shipmentData
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Card>
        <Card.Content>
          <Text style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 8 }}>
            {delivery_summary}
          </Text>

          {activity.map((item, index) => {
            const { status, address, timestamp, icon, color } = item
            return (
              <View key={index} style={styles.item_container}>
                {activity.length - 1 != index ? (
                  <View style={styles.vertical_line} />
                ) : (
                  <View
                    style={{
                      ...styles.vertical_line,
                      backgroundColor: '#FFF',
                      height: 70,
                    }}
                  />
                )}
                {icon ? (
                  <MaterialIcons
                    name={icon.replace(/_/g, '-')}
                    size={15}
                    style={{ position: 'absolute' }}
                    color={`#${color}`}
                  />
                ) : (
                  <View style={styles.dot} />
                )}
                <View style={{ marginLeft: 25 }}>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 14,
                      fontWeight: '600',
                    }}
                  >
                    {timestamp.formatted_date}
                  </Text>
                  <Text style={{ color: '#808080', fontSize: 13 }}>
                    {address.city}, {address.state}, {address.country}
                  </Text>
                  <Text
                    style={{
                      color: color ? `#${color}` : '#808080',
                      fontSize: 12,
                    }}
                  >
                    {status}
                  </Text>
                </View>
              </View>
            )
          })}
        </Card.Content>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    padding: 20,
  },
  item_container: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    position: 'absolute',
    top: 4,
    left: 1.5,
  },
  vertical_line: {
    height: 100,
    width: 1,
    backgroundColor: 'gray',
    position: 'absolute',
    left: 6,
    top: 10,
  },
})

export default ShipmentTrackingTab
