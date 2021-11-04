import React, { useEffect, useContext, useState } from 'react'
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native'
import { GlobalContext } from '../../../../../Main'

import { fetchSuppliersAPI } from 'services/helpers/apis/supplier'
import {
  createRfqLineAPI,
  createRfqAPI,
  getRfqMessageTemplateAPI,
} from 'services/helpers/apis/rfq'

import AddRfqForm from '../components/addRfqForm'
import SendRfq from '../components/sendRfq'

import { MaterialIcons } from '@expo/vector-icons'

const AddToRfqForm = ({ partNumbers, requisition, onRfqSent, onClose }) => {
  const [suppliersList, setSuppliersList] = useState([])
  const [createdRfqId, setCreatedRfqId] = useState(null)
  const [rfqFormValues, setRfqFormValues] = useState(null)
  const [openRfqModal, setOpenRfqModal] = useState(false)
  const [messageTemplate, setMessageTemplate] = useState(null)
  const [createdRfqLineUuid, setCreatedRfqLineUuid] = useState(null)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const context = useContext(GlobalContext)

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await fetchSuppliersAPI()

        setSuppliersList(res.data.data)
      } catch (e) {
        context.onApiError(e)
      }
    }

    fetchSuppliers()
  }, [])

  const createRfqLine = async (rfqId) => {
    try {
      let lineBody = {
        quantity: rfqFormValues.quantity,
        part_number: rfqFormValues.partNumber,
        rfq_id: rfqId,
        requisition_uuid: requisition.requisition.uuid,
      }
      if (rfqFormValues.manufacturer_id) {
        lineBody = {
          ...lineBody,
          manufacturer_id: rfqFormValues.manufacturer_id,
        }
      }
      const createRfqLine = await createRfqLineAPI(lineBody)
      const getRfqMessageTemplate = await getRfqMessageTemplateAPI(rfqId)

      setOpenRfqModal(true)
      setCreatedRfqId(rfqId)
      setMessageTemplate(getRfqMessageTemplate.data.data)
      setCreatedRfqLineUuid(createRfqLine.data.data.uuid)
    } catch (e) {
      context.onApiError(e)
    }
  }

  const createRfq = async (supplierId) => {
    try {
      const res = await createRfqAPI(supplierId)
      const rfqId = res.data.data.rfq_id

      setCreatedRfqId(rfqId)
      createRfqLine(rfqId)
    } catch (e) {
      context.onApiError(e)
    }
  }

  const onAddRfqFormSubmit = (values) => {
    const formValues = values
    setRfqFormValues(formValues)
    setFormSubmitted(true)
  }

  useEffect(() => {
    if (formSubmitted) {
      if (rfqFormValues.rfqId === 'new_rfq') {
        createRfq(rfqFormValues.supplierId)
      } else {
        createRfqLine(rfqFormValues.rfqId)
      }

      setFormSubmitted(false)
    }
  }, [rfqFormValues, formSubmitted])

  const onCloseAddRfqModal = () => {
    setOpenRfqModal(false)
    onClose()
  }

  const saveRfq = () => {
    setOpenRfqModal(false)
    onRfqSent()
    context.onApiSuccess(`RFQ ${createdRfqId} Created`)
  }

  return (
    <>
      <View style={styles.modal_wrapper}>
        <View style={styles.content}>
          {partNumbers && (
            <AddRfqForm
              requisition={requisition}
              onSubmit={onAddRfqFormSubmit}
              partNumbers={partNumbers}
              suppliersList={suppliersList}
            />
          )}

          <TouchableOpacity
            style={{ position: 'absolute', top: 10, right: 10 }}
            onPress={onClose}
          >
            <MaterialIcons name='close' size={20} color='gray' />
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={openRfqModal} transparent animationType='fade'>
        <SendRfq
          onClose={onCloseAddRfqModal}
          messageTemplate={messageTemplate}
          saveRfq={saveRfq}
          rfqId={createdRfqId}
          rfqLineUuid={createdRfqLineUuid}
          onRfqSent={onRfqSent}
        />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  modal_wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: '#0000004D',
  },
  content: {
    width: '90%',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  uploadLogo: {
    height: 80,
    width: 100,
    borderRadius: 8,
    borderColor: '#808080',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderStyle: 'dashed',
  },
  imageLogo: {
    height: 80,
    width: 100,
    borderRadius: 8,
    borderColor: '#808080',
    marginVertical: 10,
  },
})

export default AddToRfqForm
