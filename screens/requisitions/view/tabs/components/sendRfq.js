import React, { useState, useContext, useEffect } from 'react'
import { View, StyleSheet, TextInput, Dimensions } from 'react-native'
import { confirmRfqAPI, cancelRfqLineAPI } from 'services/helpers/apis/rfq'
import { Button } from 'react-native-paper'
import { GlobalContext } from '../../../../../Main'

const SendRfq = ({
  onRfqSent = () => {},
  messageTemplate,
  rfqId,
  rfqLineUuid,
  saveRfq,
  onClose,
}) => {
  const [modalMessageTemplate, setModalMessageTemplate] = useState('')
  const context = useContext(GlobalContext)

  useEffect(() => {
    if (messageTemplate) {
      setModalMessageTemplate(messageTemplate)
    }
  }, [messageTemplate])

  const sendRfq = async () => {
    try {
      const confirmRfq = await confirmRfqAPI(rfqId, modalMessageTemplate)
      context.onApiSuccess(
        `RFQ ${confirmRfq.data.data.rfq_id} Sent to ${confirmRfq.data.data.supplier}`
      )
      onRfqSent()
      onClose()
    } catch (e) {
      context.onApiError(e)
    }
  }

  const cancelRfq = async () => {
    try {
      await cancelRfqLineAPI(rfqLineUuid)

      onClose()
    } catch (e) {
      context.onApiError(e)
    }
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
          value={messageTemplate}
          onChangeText={onMessageUpdate}
        />

        <View style={{ flexDirection: 'row' }}>
          <Button
            style={styles.button}
            mode='contained'
            color='red'
            onPress={cancelRfq}
          >
            Cancel
          </Button>
          <View style={{ flexGrow: 1 }} />
          <Button
            style={styles.button}
            mode='contained'
            color='orange'
            onPress={() => {}}
          >
            View RFQ
          </Button>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Button
            style={styles.button}
            mode='contained'
            color='green'
            onPress={saveRfq}
          >
            Save Draft
          </Button>
          <View style={{ flexGrow: 1 }} />
          <Button style={styles.button} mode='contained' onPress={sendRfq}>
            Send
          </Button>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 7,
    width: '45%',
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

export default SendRfq
