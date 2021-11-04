import React, { useState, useContext } from 'react'
import { View, StyleSheet, TextInput, Dimensions } from 'react-native'
import { Button } from 'react-native-paper'
import { GlobalContext } from '../../Main'

import rfqActions from 'services/redux/rfq/actions'
import purchaseOrderActions from 'services/redux/purchaseOrder/actions'
import { confirmPoAPI } from 'services/helpers/apis/po'
import { confirmRfqAPI } from 'services/helpers/apis/rfq'

const { onRfqSend } = rfqActions
const { onPoSend } = purchaseOrderActions

const SendMessageTemplateModal = ({
  message,
  id,
  onClose,
  modalFor = 'rfq',
}) => {
  const [modalMessageTemplate, setModalMessageTemplate] = useState(message)
  const context = useContext(GlobalContext)

  const sendRfq = async () => {
    try {
      let confirmResponse
      if (modalFor === 'rfq') {
        confirmResponse = await confirmRfqAPI(id, modalMessageTemplate)
        dispatch(onRfqSend(id))
      } else {
        confirmResponse = await confirmPoAPI(id, modalMessageTemplate)
        dispatch(onPoSend(id))
      }
      context.onApiSuccess(
        `${modalFor === 'rfq' ? 'RFQ' : 'PO'} ${
          modalFor === 'rfq'
            ? confirmResponse.data.data.rfq_id
            : confirmResponse.data.data.po_id
        } Sent to ${confirmResponse.data.data.supplier}`
      )
      onRfqSent()
      onClose()
    } catch (e) {
      context.onApiError(e)
    }
  }

  const cancelRfq = async () => {
    onClose()
  }

  const onMessageUpdate = (value) => {
    setModalMessageTemplate(value)
  }

  return (
    <View style={styles.modal_wrapper}>
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={10}
          value={modalMessageTemplate}
          onChangeText={onMessageUpdate}
        />

        <Button
          style={styles.button}
          mode='contained'
          color='red'
          onPress={cancelRfq}
        >
          Cancel
        </Button>

        <Button style={styles.button} mode='contained' onPress={sendRfq}>
          Send
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 5,
  },
  modal_wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: '#0000004D',
  },
  content: {
    width: '90%',
    maxHeight: Dimensions.get('window').height * 0.6,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'blue',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 10,
    paddingVertical: 15,
  },
  input: {
    borderWidth: 0.5,
    borderColor: 'gray',
    marginBottom: 5,
    borderRadius: 5,
    paddingHorizontal: 5,
  },
})

export default SendMessageTemplateModal
