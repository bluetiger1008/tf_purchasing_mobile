import React, { useState, useEffect, useContext } from 'react'
import { View, StyleSheet, Modal } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _filter from 'lodash/filter'
import _isEmpty from 'lodash/isEmpty'
import { Title, Button, Subheading, Text } from 'react-native-paper'
import {
  getRfqDraftAPI,
  createRfqAPI,
  createRfqLineAPI,
  getRfqMessageTemplateAPI,
} from 'services/helpers/apis/rfq'
import AccordionItem from 'components/accordionItem'

import InventoryTable from 'components/inventory/inventoryTable'
import { GlobalContext } from '../../../../../Main'
import SendRfq from '../components/sendRfq'

const TableList = ({ inventory, requisition }) => {
  const context = useContext(GlobalContext)
  const { supplier } = inventory
  const { banner } = supplier
  const [rfqList, setRfqList] = useState([])
  const [linesData, setLinesData] = useState([])
  const [sendRfq, setSendRfq] = useState(false)
  const [messageTemplate, setMessageTemplate] = useState(null)
  const [createdRfqLineUuid, setCreatedRfqLineUuid] = useState(null)
  const [createdRfqId, setCreatedRfqId] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchRfqDraft = async () => {
    if (!requisition) return
    try {
      if (requisition.permissions.create_rfq) {
        const draftResponse = await getRfqDraftAPI(inventory.supplier.id)

        setRfqList(draftResponse.data.data.rfq)
      }
    } catch (err) {
      context.onApiError(err)
    }
  }

  useEffect(() => {
    fetchRfqDraft()
  }, [])

  let numOr0 = (n) => (n == null ? 0 : n)
  let total = inventory.lines
    .map((lines) => lines.quantity_available)
    .reduce((a, b) => numOr0(a) + numOr0(b))

  const onSelectLine = (linesData) => {
    const data = _filter(linesData, 'selected')
    setLinesData(data)
  }

  const createRfq = async () => {
    try {
      const res = await createRfqAPI(inventory.supplier.id)
      const rfqId = res.data.data.rfq_id

      setCreatedRfqId(rfqId)
      createRfqLine(rfqId)
    } catch (e) {
      context.onApiError(e)
    }
  }

  createRfqLine = async (rfqId) => {
    setLoading(true)
    linesData.map(async (line) => {
      try {
        let requestBody = {
          quantity: line.quantity_required,
          part_number: line.part_number,
          rfq_id: rfqId,
          requisition_uuid: requisition ? requisition.requisition.uuid : null,
        }

        if (!_isEmpty(line.manufacturer)) {
          requestBody = {
            ...requestBody,
            manufacturer_id: line.manufacturer.id,
          }
        }

        const createRfqLine = await createRfqLineAPI(requestBody)

        const getRfqMessageTemplate = await getRfqMessageTemplateAPI(rfqId)

        setSendRfq(true)
        setCreatedRfqId(rfqId)
        setMessageTemplate(getRfqMessageTemplate.data.data)
        setCreatedRfqLineUuid(createRfqLine.data.data.uuid)
      } catch (e) {
        context.onApiError(e)
      } finally {
        setLoading(false)
      }
    })
  }

  const onAddRfq = () => {
    createRfq()
  }

  const saveRfq = () => {
    this.setState({
      openRfqModal: false,
    })
    context.onApiSuccess(`RFQ ${createdRfqId} Created`)
  }

  const renderStatus = () => {
    return (
      <>
        {banner && (
          <View
            style={{
              backgroundColor: banner.color,
              padding: 5,
              borderRadius: 5,
              marginLeft: 7,
            }}
          >
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>
              {banner.text}
            </Text>
          </View>
        )}
      </>
    )
  }

  return (
    <View>
      <AccordionItem
        style={styles.accordion}
        title={supplier.name}
        renderTitleComponent={renderStatus}
        showState={useState(true)}
      >
        <>
          <InventoryTable data={inventory.lines} onSelectLine={onSelectLine} />

          <Subheading>Total: {total || '0'}</Subheading>
          <Button
            loading={loading}
            disabled={linesData.length === 0 || loading}
            style={{ ...styles.button, marginTop: 12, width: 'auto' }}
            mode='contained'
            onPress={onAddRfq}
          >
            Add to RFQ {'>'}
          </Button>
        </>
      </AccordionItem>

      <Modal visible={sendRfq} animationType='fade' transparent>
        <SendRfq
          onClose={() => setSendRfq(false)}
          messageTemplate={messageTemplate}
          saveRfq={saveRfq}
          rfqId={createdRfqId}
          rfqLineUuid={createdRfqLineUuid}
        />
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  button: {
    marginVertical: 7,
  },
  accordion: {
    marginBottom: 10,
  },
})

const mapStateToProps = (state) => ({
  requisition: state.requisition.selectedRequisition,
})

export default connect(mapStateToProps)(TableList)
