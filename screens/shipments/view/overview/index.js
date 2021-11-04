import React, { useCallback, Alert } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native'
import { Card } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'

const ShipmentOverviewTab = (props) => {
  const { shipmentData } = props
  const {
    carrier_service_name,
    tracking_number,
    carrier_logo_url,
    carrier,
    track_url,
    timeline,
    from_address,
    to_address,
    dimensions,
    lines,
  } = shipmentData

  const partNumbers = Object.keys(lines)

  const openTrackURL = useCallback(async () => {
    const supported = await Linking.canOpenURL(track_url)
    if (supported) {
      await Linking.openURL(track_url)
    } else {
      Alert.alert(`Url not supported: ${track_url}`)
    }
  }, [track_url])

  const getContentItemCount = () => {
    const entry_values_nester = partNumbers.map((v) =>
      lines[v].map((t, i) => t.shipped_quantity)
    )
    const entry_values = entry_values_nester.map((v) =>
      v.reduce((a, b) => a + b, 0)
    )
    const total = entry_values.reduce((a, b) => a + b, 0)
    return total
  }

  return (
    <View style={styles.content}>
      <Card>
        <Card.Content style={styles.card_content}>
          <View style={styles.left_content}>
            <Text>{carrier_service_name}</Text>
            <Image
              source={{
                uri: carrier_logo_url,
              }}
              style={{ width: 50, height: 50, margin: 2 }}
              resizeMode='contain'
            />
          </View>

          <View style={styles.right_content}>
            <Text>Tracking #:</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              {tracking_number}
            </Text>
            <TouchableOpacity onPress={openTrackURL}>
              <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
                Track via {carrier}
              </Text>
            </TouchableOpacity>
          </View>
        </Card.Content>

        <View style={styles.divider} />

        <Card.Content style={styles.timeline_content}>
          {timeline.map((v, i) => {
            const { line1, line2, line3, icon } = v
            return (
              <View style={styles.mark_detail} key={i}>
                {i == 0 && (
                  <>
                    <View style={styles.dot} />
                    <View
                      style={{
                        ...styles.line,
                        left: 30,
                      }}
                    />
                  </>
                )}
                {i == 1 && (
                  <>
                    {!!icon && (
                      <MaterialIcons
                        name={icon.replace(/_/g, '-')}
                        size={20}
                        style={{ position: 'absolute' }}
                        color='#000'
                      />
                    )}
                  </>
                )}
                {i == 2 && (
                  <>
                    {!!icon && (
                      <MaterialIcons
                        name={icon.replace(/_/g, '-')}
                        size={20}
                        style={{ position: 'absolute' }}
                        color='#000'
                      />
                    )}
                    <View
                      style={{
                        ...styles.line,
                        right: 30,
                      }}
                    />
                  </>
                )}
                <View style={{ height: 22 }} />
                {!!line1 && <Text>{line1}</Text>}
                {!!line2 && <Text>{line2}</Text>}
                {!!line3 && <Text>{line3}</Text>}
              </View>
            )
          })}
        </Card.Content>
      </Card>

      <Card style={styles.detail_content}>
        <Card.Content>
          <Text style={{ paddingBottom: 10, fontSize: 16 }}>
            Shipment Information:
          </Text>

          <View
            style={{
              ...styles.row,
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text style={{ fontSize: 16, fontWeight: '700' }}>
                Shipped From:
              </Text>
              <Text>{from_address.postal_code}</Text>
              <Text>
                {from_address.city}, {from_address.state_province},{' '}
                {from_address.country}
              </Text>
            </View>
            <Image
              source={{ uri: from_address.image_url }}
              style={{ width: 70, height: 50 }}
              resizeMode='contain'
            />
          </View>

          <View style={{ ...styles.divider, width: '100%' }} />

          <View
            style={{
              ...styles.row,
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text style={{ fontSize: 16, fontWeight: '700' }}>
                Shipped To:
              </Text>
              <Text>{to_address.postal_code}</Text>
              <Text>
                {to_address.city}, {to_address.state_province},{' '}
                {to_address.country}
              </Text>
            </View>
            <Image
              source={{ uri: to_address.image_url }}
              style={{ width: 70, height: 50 }}
              resizeMode='contain'
            />
          </View>

          <View style={{ ...styles.divider, width: '100%' }} />

          <View style={styles.row}>
            <Text>Weight: </Text>
            <Text>
              {dimensions.weight} {dimensions.weight_measure}
            </Text>
          </View>

          <View style={styles.row}>
            <Text>Contents: </Text>
            <Text>{getContentItemCount()} Items</Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
    padding: 20,
  },
  divider: {
    width: '90%',
    height: 0.5,
    backgroundColor: 'gray',
    alignSelf: 'center',
    marginVertical: 10,
  },
  line: {
    width: 110,
    height: 1,
    backgroundColor: 'black',
    marginVertical: 10,
    position: 'absolute',
  },
  card_content: {
    flexDirection: 'row',
    width: '100%',
  },
  right_content: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  left_content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeline_content: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  mark_detail: {
    alignItems: 'center',
  },
  dot: {
    width: 15,
    height: 15,
    backgroundColor: '#000',
    margin: 2.5,
    borderRadius: 7.5,
    position: 'absolute',
  },
  detail_content: {
    marginTop: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default ShipmentOverviewTab
