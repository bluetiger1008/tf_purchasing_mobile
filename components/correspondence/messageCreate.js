import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, TextInput, Picker, Alert } from 'react-native'
import { Appbar, Button } from 'react-native-paper'
import { useCorrespondenceContext } from './context'

const MessageCreate = ({ navigation }) => {
  const correspondenceContext = useCorrespondenceContext()
  const {
    selectedRfq,
    selectedPo,
    correspondenceFor,
    onUpdateCorrespondence,
    saveDraftMessage,
    messages,
  } = correspondenceContext
  const defaultMessage = {
    is_internal: true,
    uuid: '',
    subject: '',
    is_draft: true,
  }
  const message = messages[0] || defaultMessage

  const [textMessage, setTextMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [replyValue, setReplyValue] = useState(
    message.is_internal ? 'internal' : 'supplier'
  )
  const inputRef = useRef(null)

  const handleChange = (value) => {
    setTextMessage(value)
  }

  const onChangeReplyingOption = (value) => {
    setReplyValue(value)
  }

  const onBack = () => {
    saveDraftMessage(message.uuid, {
      type: replyValue,
      subject,
      body: textMessage,
    })

    navigation.goBack()
  }

  const onSend = () => {
    onUpdateCorrespondence(message.uuid, {
      type: replyValue,
      subject,
      body: textMessage,
    })
    navigation.goBack()
  }

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={onBack} />
        <Appbar.Content title='Message' subtitle='' />

        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>

      <View style={{ padding: 20, paddingTop: 10, flex: 1 }}>
        <TextInput
          placeholder='Enter Subject name'
          value={subject}
          onChangeText={(e) => setSubject(e)}
          ref={inputRef}
        />

        <View style={styles.pickerWrapper}>
          <Picker
            onValueChange={onChangeReplyingOption}
            collapsable={false}
            mode='dropdown'
            selectedValue={replyValue}
          >
            <Picker.Item label={'Internal Note'} value={'internal'} />
            <Picker.Item
              label={`Message to supplier (${
                correspondenceFor == 'rpq'
                  ? selectedRfq.supplier
                  : selectedPo.supplier
              })`}
              value={'supplier'}
            />
          </Picker>
        </View>

        <TextInput
          editable={message.is_draft}
          style={{
            borderColor: 'gray',
            borderWidth: 0.5,
            padding: 5,
          }}
          placeholder='Type a message...'
          multiline
          scrollEnabled
          value={textMessage}
          onChangeText={handleChange}
        />
      </View>

      <View style={{ padding: 20 }}>
        {message.is_draft && (
          <Button
            style={{ ...styles.button }}
            mode='contained'
            icon='send'
            onPress={onSend}
          >
            Send
          </Button>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  pickerWrapper: {
    borderBottomColor: '#000',
    borderBottomWidth: 0.5,
    marginTop: 5,
    marginBottom: 10,
  },
})

export default MessageCreate
