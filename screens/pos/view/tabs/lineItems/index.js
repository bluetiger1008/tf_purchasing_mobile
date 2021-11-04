import React, { useState, useContext, useEffect } from 'react'
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { Text, Card, FAB, Portal, Provider } from 'react-native-paper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { GlobalContext } from '../../../../../Main'
import { TextPair } from 'components'
import rfqActions from 'services/redux/rfq/actions'
import colors from 'common/colors'
import _remove from 'lodash/remove'
import _isEmpty from 'lodash/isEmpty'
import _find from 'lodash/find'

import AccordionItem from 'components/accordionItem'
import leadTimeValues from 'utils/leadTimes'

import { usePoListContext } from '../../../context'
import { MaterialIcons } from '@expo/vector-icons'

import EditInfo from './editInfo'
import AddLine from './addLine'
import EditLine from './editLine'

import moment from 'moment'
import { formatCurrency } from 'utils/formatter'

import {
  deletePoAPI,
  getPoMessageTemplateAPI,
  updatePoStatusAPI,
} from 'services/helpers/apis/po'

import {
  getCarriersList,
  getCarriersServicesList,
} from 'services/helpers/apis/carrier'
const { onRfqDelete } = rfqActions

const LineItems = ({ selectedPo, navigation }) => {
  const {
    purchaseOrderData,
    manufacturerList,
    statusList,
    fetchPurchaseOrder,
  } = usePoListContext()

  const context = useContext(GlobalContext)

  const [lineItems, setLineItems] = useState([])
  const [carriersList, setCarriersList] = useState([])
  const [carriersServiceList, setCarriersServiceList] = useState([])
  const infoState = useState({
    carrier: purchaseOrderData.carrier_service.carrier_id,
    carrierService: purchaseOrderData.carrier_service.id,
    dateConfirmed: purchaseOrderData.date_confirmed.timestamp,
  })
  const [info, setInfo] = infoState
  const [showEditInfo, setShowEditInfo] = useState(false)
  const [showAddLine, setShowAddLine] = useState(false)
  const [showEditLine, setShowEditLine] = useState(false)
  const [selectedLine, setSelectedLine] = useState(null)
  const [statusToUpdate, setStatusToUpdate] = useState()

  const [state, setState] = React.useState({ open: false })
  const onStateChange = ({ open }) => setState({ open })
  const { open } = state

  const { can_edit_lines, can_delete, can_submit } =
    purchaseOrderData.permissions

  const fetchCarriersService = async (carrierId) => {
    try {
      const carrierListResponse = await getCarriersServicesList(carrierId)

      setCarriersServiceList(carrierListResponse.data.data)
    } catch (e) {
      console.log(e, 'error')
      context.onApiError(e)
    }
  }

  const fetchCarriers = async () => {
    try {
      const carriersResponse = await getCarriersList()

      setCarriersList(carriersResponse.data.data)

      if (!_isEmpty(purchaseOrderData.carrier_service)) {
        setDefaultCarriers()
      }
    } catch (e) {
      console.log(e, 'error')
      context.onApiError(e)
    }
  }

  const setDefaultCarriers = () => {
    setInfo({
      ...info,
      carrier: purchaseOrderData.carrier_service.carrier_id,
    })
    fetchCarriersService(purchaseOrderData.carrier_service.carrier_id)
  }

  const onLineAdded = (newLine) => {
    const tempLineArray = [...lineItems]
    tempLineArray.push(newLine)
    setLineItems(tempLineArray)
  }

  const onOpenAddlineModal = () => {
    if (!can_edit_lines) {
      alert('Cannot add items on this status')
      return
    }
    setShowAddLine(true)
  }

  useEffect(() => {
    if (!_isEmpty(purchaseOrderData.carrier_service)) {
      setInfo({
        ...info,
        carrierService: purchaseOrderData.carrier_service.id,
      })
    }
  }, [carriersList])

  useEffect(() => {
    fetchCarriers()
  }, [])

  useEffect(() => {
    if (purchaseOrderData) {
      setLineItems(purchaseOrderData.lines.lines)
    }
  }, [purchaseOrderData])

  const onUpdateLine = (updatedLine) => {
    const index = lineItems.findIndex((e) => e.uuid == updatedLine.uuid)
    const tempRows = [...lineItems]
    tempRows[index] = {
      ...tempRows[index],
      ...updatedLine,
    }

    setLineItems(tempRows)
  }

  const onDeleteLine = (uuid) => {
    const tempLineArray = [...lineItems]
    _remove(tempLineArray, function (n) {
      return n.uuid === uuid
    })
    setLineItems([...tempLineArray])
  }

  const onSelectLine = (row) => {
    setSelectedLine(row)
    setShowEditLine(true)
  }

  const onDeletePo = async () => {
    if (!can_delete) {
      updateStatusToChange('DELETE_PO')
      return
    }

    try {
      await deletePoAPI(purchaseOrderData.uuid)
      context.onApiSuccess(
        'Purchase Order '`Purchase Order ${purchaseOrderData.id} is deleted`
      )
      navigation.goBack()
    } catch (e) {
      context.onApiError(e)
    }
  }

  const onSubmitPo = async () => {
    if (!can_submit) {
      alert('Cannot submit on this status')
      return
    }
    try {
      const poMessageResponse = await getPoMessageTemplateAPI(
        purchaseOrderData.uuid
      )
      alert(poMessageResponse.data.data)
    } catch (e) {
      console.log(e, 'error')
      context.onApiError(e)
    }
  }

  const updateStatusToChange = async (type) => {
    const currentStatusIndex = statusList.findIndex(
      (e) => e.id === purchaseOrderData.status_id
    )

    const arr1 = statusList.slice(0, currentStatusIndex)
    const arr2 = statusList.slice(currentStatusIndex + 1, statusList.length + 1)
    const statusListForSearch = [...arr1.reverse(), ...arr2.reverse()]
    let selectedStatusToUpdate
    if (type === 'DELETE_PO') {
      selectedStatusToUpdate = _find(statusListForSearch, function (x) {
        return x.permissions.can_delete === true
      })

      selectedStatusToUpdate.statusMessage =
        'To delete this purchase order you need to change the status'
    } else if (type === 'EDIT_PO') {
      selectedStatusToUpdate = _find(statusListForSearch, function (x) {
        return x.permissions.can_edit === true
      })
      selectedStatusToUpdate.statusMessage =
        'To edit this purchase order you need to change the status'
    } else if (type === 'DELETE_LINE') {
      selectedStatusToUpdate = _find(statusListForSearch, function (x) {
        return x.permissions.can_delete_lines === true
      })
      selectedStatusToUpdate.statusMessage =
        'To delete this line you need to change the status'
    }

    selectedStatusToUpdate.statusType = type
    setStatusToUpdate(selectedStatusToUpdate)
  }
  const onEditPo = () => {
    updateStatusToChange('EDIT_PO')
  }

  const onChangeStatus = async (changeStatusType) => {
    try {
      if (changeStatusType === 'DELETE_PO') {
        await updatePoStatusAPI(purchaseOrderData.uuid, statusToUpdate.id)
        await deletePoAPI(purchaseOrderData.uuid)

        // toast.success(`Po ${purchaseOrderData.id} is deleted.`)
      } else if (changeStatusType === 'EDIT_PO') {
        await updatePoStatusAPI(purchaseOrderData.uuid, statusToUpdate.id)
        fetchPurchaseOrder(purchaseOrderData.uuid, { showLoading: false })
        context.onApiSuccess(`Po ${purchaseOrderData.id} is updated.`)

        // toast.success(`Po ${purchaseOrderData.id} is updated.`)
      } else if (changeStatusType === 'DELETE_LINE') {
        await updatePoStatusAPI(purchaseOrderData.uuid, statusToUpdate.id)
        onDeleteLine()
      }

      setStatusToUpdate(null)
    } catch (e) {
      console.log(e, 'error')
      context.onApiError(e)
    }
  }

  useEffect(() => {
    if (statusToUpdate) {
      Alert.alert('Note', statusToUpdate.statusMessage, [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setStatusToUpdate(null),
        },
        {
          text: `Change status to ${statusToUpdate && statusToUpdate.status}`,
          onPress: () => onChangeStatus(statusToUpdate.statusType),
        },
      ])
    }
  }, [statusToUpdate])

  const selectedCarrier = info.carrier
    ? _find(carriersList, { id: info.carrier })
    : ''
  const carrierText = selectedCarrier ? selectedCarrier.carrier : '-- --'

  const selectedCarrierService = info.carrierService
    ? _find(carriersServiceList, {
        id: info.carrierService,
      })
    : null
  const carrierServiceText = selectedCarrierService
    ? selectedCarrierService.name
    : '-- --'
  return (
    <>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={{ marginBottom: 10 }}>
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <View>
                {carriersList.length > 0 && (
                  <>
                    <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
                      {' '}
                      Carrier: {carrierText}
                    </Text>
                  </>
                )}
                {carriersServiceList.length > 0 && (
                  <>
                    <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
                      {' '}
                      Service: {carrierServiceText}
                    </Text>
                  </>
                )}
                {Object.keys(purchaseOrderData.date_confirmed).length !==
                  0 > 0 && (
                  <>
                    <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
                      {' '}
                      Date:{' '}
                      {moment(info.dateConfirmed).format('MM/DD/YYYY HH:mm A')}
                    </Text>
                  </>
                )}
              </View>

              <View>
                <Text>
                  Total Pieces: {purchaseOrderData.lines.total_pieces}{' '}
                </Text>
                <Text>
                  Total Pieces: $
                  {parseFloat(purchaseOrderData.lines.total_price).toFixed(2)}{' '}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setShowEditInfo(true)
              }}
            >
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  padding: 5,
                  paddingBottom: 0,
                }}
              >
                <Text style={{ color: 'blue', fontSize: 16, marginRight: 5 }}>
                  Edit
                </Text>
                <MaterialIcons name='edit' color='blue' size={15} />
              </View>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        {lineItems.map((row, i) => {
          return (
            <Card
              key={i}
              onPress={() => {
                onSelectLine(row)
              }}
              style={{ marginBottom: 10 }}
            >
              <Card.Content>
                <Text
                  style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}
                >
                  Requisition ID:{' '}
                  <Text
                    style={{
                      color: row.requisition_detail.order_id ? 'blue' : '#000',
                      fontSize: 16,
                      textDecorationLine: row.requisition_detail.order_id
                        ? 'underline'
                        : 'none',
                    }}
                  >
                    {row.requisition_detail.order_id || '-- --'}
                  </Text>
                </Text>

                <View style={{ flexDirection: 'row', width: '100%' }}>
                  <TextPair
                    style={{ width: '50%' }}
                    text={'Quantity'}
                    value={row.quantity || '-- --'}
                  />
                  <TextPair
                    style={{ width: '50%' }}
                    text={'Manufacturer'}
                    value={
                      !_isEmpty(row.manufacturer)
                        ? row.manufacturer.id
                        : '-- --'
                    }
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    marginVertical: 5,
                  }}
                >
                  <TextPair
                    style={{ width: '50%' }}
                    text={'Part Number'}
                    value={row.item || '-- --'}
                  />
                  <TextPair
                    style={{ width: '50%' }}
                    text={'Supplier Part Number'}
                    value={row.supplier_part_number || '-- --'}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    marginVertical: 5,
                  }}
                >
                  <TextPair
                    style={{ width: '50%' }}
                    text={'Unit Price'}
                    value={`$${formatCurrency(row.unit_cost)}` || '-- --'}
                  />
                  <TextPair
                    style={{ width: '50%' }}
                    text={'Extended Price'}
                    value={
                      row.extended_cost
                        ? `$${row.extended_cost}`
                        : `$${formatCurrency(row.unit_cost * row.quantity)}`
                    }
                  />
                </View>

                <AccordionItem
                  style={styles.accordion}
                  title='Dispatch Schedule'
                  expanded={false}
                  customState={true}
                >
                  {row.dispatch_schedule.map((schedule, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          width: '100%',
                          marginVertical: 10,
                        }}
                      >
                        <TextPair
                          style={{ width: '50%' }}
                          text={'Quantity'}
                          value={schedule.quantity || '-- --'}
                        />
                        <TextPair
                          style={{ width: '50%' }}
                          text={'Lead Time'}
                          value={
                            schedule.lead_time_menu
                              ? _find(leadTimeValues, {
                                  value: schedule.lead_time_menu,
                                }).label
                              : '-- --'
                          }
                        />
                      </View>
                    )
                  })}
                </AccordionItem>
              </Card.Content>
            </Card>
          )
        })}
      </ScrollView>
      <Modal visible={showEditInfo} transparent animationType='fade'>
        <EditInfo
          carriersList={carriersList}
          carriersServiceList={carriersServiceList}
          fetchCarriersService={fetchCarriersService}
          uuid={purchaseOrderData.uuid}
          onClose={() => setShowEditInfo(false)}
          permissions={purchaseOrderData.permissions}
          defaultInfo={info}
          onUpdate={(updatedInfo) => setInfo(updatedInfo)}
        />
      </Modal>
      <Modal visible={showAddLine} transparent animationType='fade'>
        <AddLine
          onClose={() => setShowAddLine(false)}
          onLineAdded={onLineAdded}
          purchaseOrderData={purchaseOrderData}
        />
      </Modal>
      <Modal
        visible={showEditLine && !!selectedLine}
        transparent
        animationType='fade'
      >
        <EditLine
          manufacturerList={manufacturerList}
          selectedLine={selectedLine}
          onClose={() => setShowEditLine(false)}
          onUpdateLine={onUpdateLine}
          onDeleteLine={onDeleteLine}
          permitted={purchaseOrderData.permissions.can_edit_lines}
        />
      </Modal>

      <Provider>
        <Portal>
          <FAB.Group
            open={open}
            fabStyle={{ backgroundColor: colors.primary }}
            icon={open ? 'chevron-down' : 'chevron-up'}
            actions={[
              {
                icon: 'plus',
                label: 'Add',
                style: { backgroundColor: 'red' },
                onPress: onOpenAddlineModal,
              },
              {
                icon: 'chevron-right',
                label: 'send',
                style: { backgroundColor: 'yellow' },
                onPress: onSubmitPo,
              },
              {
                icon: 'lead-pencil',
                label: 'edit',
                style: { backgroundColor: 'green' },
                onPress: onEditPo,
              },
              {
                icon: 'delete',
                label: 'Delete',

                style: { backgroundColor: colors.primary },
                onPress: onDeletePo,
              },
            ]}
            onStateChange={onStateChange}
            onPress={() => {
              if (open) {
                // do something if the speed dial is open
              }
            }}
          />
        </Portal>
      </Provider>
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  accordion: {
    marginBottom: 10,
  },
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onRfqDelete,
    },
    dispatch
  )

export default connect(null, mapDispatchToProps)(LineItems)
