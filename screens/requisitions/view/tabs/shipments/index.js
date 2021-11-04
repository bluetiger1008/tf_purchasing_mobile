import React, { useState, useContext, useEffect } from 'react'
import { View, ScrollView, Modal, StyleSheet } from 'react-native'
import { Text, Button, FAB } from 'react-native-paper'
import { fetchShipmentTrackingAPI } from 'services/helpers/apis/other'
import { getRequisitionShipmentsAPI } from 'services/helpers/apis/requisition'
import { GlobalContext } from '../../../../../Main'
import ShipmentsStatus from './shipmentsStatus'
import AddShipments from './addShipments'
import Loader from 'components/loader'

const Shipments = ({ uuid }) => {
  const context = useContext(GlobalContext)
  const [shipmentData, setShipmentData] = useState(null)
  const [shipmentTracks, setShipmentTracks] = useState(null)
  const [loading, setLoading] = useState(false)

  const [addShowModal, setAddShowModal] = useState(false)
  const fetchApis = async () => {
    setLoading(true)
    try {
      const shipmentsResponse = await getRequisitionShipmentsAPI(uuid)
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

  const showShipmentStatus = shipmentTracks
  const showNoShipmentView = shipmentTracks

  return (
    <>
      <ScrollView style={styles.content}>
        {shipmentData && (
          <>
            {shipmentTracks && <ShipmentsStatus shipments={shipmentTracks} />}

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
                    There is no shipments to view
                  </Text>
                  {shipmentTracks && (
                    <Button
                      mode='contained'
                      onPress={() => setAddShowModal(true)}
                    >
                      Create a shipment
                    </Button>
                  )}
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
      {shipmentTracks && (
        <FAB
          style={styles.fab}
          small
          icon='plus'
          onPress={() => {
            setAddShowModal(true)
          }}
        />
      )}
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
