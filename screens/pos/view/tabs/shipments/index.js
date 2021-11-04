import React, { useState, useContext, useEffect } from 'react'
import { View, ScrollView, Modal, StyleSheet } from 'react-native'
import { Text, Button, FAB } from 'react-native-paper'
import {
  fetchShipmentAPI,
  fetchShipmentTrackingAPI,
} from 'services/helpers/apis/other'
import { usePoListContext } from '../../../context'
import { GlobalContext } from '../../../../../Main'
import ShipmentsStatus from './shipmentsStatus'
import AddShipments from './addShipments'
import Loader from 'components/loader'

const Shipments = ({ navigation }) => {
  const { purchaseOrderData } = usePoListContext()
  const context = useContext(GlobalContext)
  const [shipmentData, setShipmentData] = useState(null)
  const [shipmentTracks, setShipmentTracks] = useState(null)
  const [loading, setLoading] = useState(false)

  const [addShowModal, setAddShowModal] = useState(false)
  const fetchApis = async () => {
    setLoading(true)
    try {
      const shipmentsResponse = await fetchShipmentAPI(purchaseOrderData.uuid)
      setShipmentData(shipmentsResponse.data.data)

      const { shipments } = shipmentsResponse.data.data

      if (shipments && shipments.length > 0) {
        let shipmentInfos = []
        await Promise.all(
          shipments.map(async (shipment) => {
            try {
              const shipmentTrackingResponse = await fetchShipmentTrackingAPI(
                shipment,
                purchaseOrderData.uuid
              )
              shipmentInfos = [
                ...shipmentInfos,
                shipmentTrackingResponse.data.data,
              ]
            } catch (e) {
              console.log(e)
            }
          })
        )

        setShipmentTracks([...shipmentInfos])
      }
    } catch (e) {
      context.onApiError(e)
    } finally {
      setLoading(false)
    }
  }

  const onAddedShipment = () => {
    setAddShowModal(false)
    fetchApis()
  }

  useEffect(() => {
    fetchApis()
  }, [])

  if (loading)
    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Loader />
      </View>
    )

  const showShipmentStatus = shipmentData
    ? shipmentData.purchase_order.permissions.can_view_shipment &&
      shipmentTracks
    : false
  const showNoShipmentView = shipmentData
    ? shipmentData.purchase_order.permissions.can_create_shipment &&
      shipmentData.shipments.length === 0
    : false
  return (
    <>
      <ScrollView style={styles.content}>
        {shipmentData && (
          <>
            {showShipmentStatus && (
              <ShipmentsStatus shipments={shipmentTracks} />
            )}

            {showNoShipmentView ||
              (!showShipmentStatus && (
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{ color: 'gray', fontSize: 16, marginBottom: 10 }}
                  >
                    There no shipments to view
                  </Text>
                  <Button
                    mode='contained'
                    onPress={() => setAddShowModal(true)}
                  >
                    Create a shipment
                  </Button>
                </View>
              ))}
          </>
        )}
      </ScrollView>
      <Modal visible={addShowModal} transparent animationType='fade'>
        <AddShipments
          remainingLines={shipmentData ? shipmentData.remaining_lines : []}
          onClose={() => setAddShowModal(false)}
          onAddedShipment={onAddedShipment}
        />
      </Modal>
      <FAB
        style={styles.fab}
        small
        icon='plus'
        onPress={() => {
          setAddShowModal(true)
        }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#db0462',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Shipments
