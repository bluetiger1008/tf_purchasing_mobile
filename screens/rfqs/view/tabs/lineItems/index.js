import React, { useState, useContext, useEffect } from 'react'
import { View, StyleSheet, ScrollView, Modal } from 'react-native'
import { Text, Card, FAB, Portal, Provider } from 'react-native-paper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { GlobalContext } from '../../../../../Main'
import { getManufacturerListAPI } from 'services/helpers/apis/other'
import { TextPair } from 'components'
import rfqActions from 'services/redux/rfq/actions'
import colors from 'common/colors'
import _remove from 'lodash/remove'
import AddLine from './addLine'
import EditLine from './editLine'
import SendMessageTemplateModal from 'components/sendMessageTemplateModal'

import {
  updateRfqLineAPI,
  deleteRfqLineAPI,
  deleteRfqAPI,
  getRfqMessageTemplateAPI,
  createRfqLineAPI,
} from 'services/helpers/apis/rfq'
const { onRfqDelete } = rfqActions

const LineItems = ({ selectedRfq, onRfqDelete, navigation }) => {
  const [rows, setRows] = useState(selectedRfq.lines)
  const [manufacturerList, setManufacturerList] = useState(null)
  const [rfqConfirmMessage, setRfqConfirmMessage] = useState(null)
  const [selectedLine, setSelectedLine] = useState(null)
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const context = useContext(GlobalContext)

  const [state, setState] = React.useState({ open: false })

  const onStateChange = ({ open }) => setState({ open })

  const { open } = state

  useEffect(() => {
    const getManufacturerList = async () => {
      try {
        const res = await getManufacturerListAPI()
        setManufacturerList(res.data.data)
      } catch (e) {
        context.onApiError(e)
      }
    }

    getManufacturerList()
  }, [])

  const onDeleteRfq = async () => {
    if (!selectedRfq.permissions.can_delete) {
      alert('cannot delete')
      return
    }
    try {
      await deleteRfqAPI(selectedRfq.uuid)
      context.onApiSuccess(`Rfq ${selectedRfq.id} is deleted.`)
      navigation.goBack()
    } catch (e) {
      context.onApiError(e)
    }
  }

  const onSubmitRfq = async () => {
    try {
      const res = await getRfqMessageTemplateAPI(selectedRfq.id)
      setRfqConfirmMessage(res.data.data)
    } catch (e) {
      context.onApiError(e)
    }
  }

  const sendRfq = () => {
    if (!selectedRfq.permissions.can_edit_lines) {
      alert('cannot send')
      return
    }
    onSubmitRfq()
  }

  const onUpdateRfq = async () => {}

  const openAddLineModal = () => {
    if (!selectedRfq.permissions.can_edit_lines) {
      alert('Cannot add')
      return
    }
    setAddModal(true)
  }

  const onSaveNewLine = async (value) => {
    try {
      const createdRfqLineResponse = await createRfqLineAPI({
        quantity: value.quantity,
        item: value.part_number,
        supplier_part_number: value.supplier_part_number,
        manufacturer_id: value.manufacturer_id,
        rfq_id: selectedRfq.id,
      })
      const createdLineData = createdRfqLineResponse.data.data

      const newRows = [
        ...rows,
        {
          ...createdLineData,
          supplier_part_number_custom:
            createdLineData.supplier_part_number_custom !== 0,
        },
      ]
      context.onApiSuccess('New line item is added.')
      setRows(newRows)
    } catch (e) {
      context.onApiError(e)
    } finally {
      setAddModal(false)
    }
  }

  const onUpdateLine = async (value) => {
    try {
      await updateRfqLineAPI(selectedLine.uuid, {
        quantity: value.quantity,
        item: value.part_number,
        supplier_part_number: value.supplier_part_number,
        manufacturer_id: value.manufacturer_id,
      })

      const index = rows.findIndex((e) => e.uuid == selectedLine.uuid)

      const tempRows = [...rows]
      tempRows[index] = {
        ...tempRows[index],
        quantity: value.quantity,
        manufacturer: {
          ...tempRows[index].manufacturer,
          id: value.manufacturer_id,
        },
      }

      setRows(tempRows)
      context.onApiSuccess('Selected line item is updated.')
    } catch (error) {
      context.onApiError(e)
    } finally {
      setEditModal(false)
    }
  }

  const onDeleteLine = async () => {
    try {
      await deleteRfqLineAPI(selectedLine.uuid)
      const array = rows
      _remove(array, function (n) {
        return n.uuid === selectedLine.uuid
      })
      setRows([...array])
      context.onApiSuccess('Selected line item is deleted.')
    } catch (e) {
      context.onApiError(e)
    } finally {
      setEditModal(false)
    }
  }

  const onSelectLine = (row) => {
    setSelectedLine(row)
    setEditModal(true)
  }
  return (
    <>
      <ScrollView contentContainerStyle={styles.content}>
        {rows.map((row, i) => {
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
                    value={row.manufacturer.id || '-- --'}
                  />
                </View>

                <View style={{ flexDirection: 'row', width: '100%' }}>
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
              </Card.Content>
            </Card>
          )
        })}
      </ScrollView>
      <Modal visible={addModal} transparent animationType='fade'>
        <AddLine
          manufacturerList={manufacturerList}
          onClose={() => setAddModal(false)}
          onSave={onSaveNewLine}
        />
      </Modal>
      <Modal
        visible={editModal && !!selectedLine}
        transparent
        animationType='fade'
      >
        <EditLine
          manufacturerList={manufacturerList}
          selectedLine={selectedLine}
          onClose={() => setEditModal(false)}
          onUpdate={onUpdateLine}
          onDelete={onDeleteLine}
          permitted={selectedRfq.permissions.can_edit_lines}
        />
      </Modal>
      <Modal visible={!!rfqConfirmMessage} transparent animationType='fade'>
        <SendMessageTemplateModal
          message={rfqConfirmMessage}
          id={selectedRfq.id}
          onClose={() => setRfqConfirmMessage(null)}
          modalFor='rfq'
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
                onPress: openAddLineModal,
              },
              {
                icon: 'chevron-right',
                label: 'send',
                style: { backgroundColor: 'yellow' },
                onPress: sendRfq,
              },
              {
                icon: 'delete',
                label: 'Delete',

                style: { backgroundColor: colors.primary },
                onPress: onDeleteRfq,
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
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onRfqDelete,
    },
    dispatch
  )

export default connect(null, mapDispatchToProps)(LineItems)
