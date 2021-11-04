import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, TextInput, Picker, Alert } from 'react-native'
import { Appbar, Text, IconButton, Button } from 'react-native-paper'
import { useCorrespondenceContext } from './context'
import moment from 'moment'

const MessageEditable = ({ navigation, route }) => {
  const correspondenceContext = useCorrespondenceContext()
  const {
    selectedRfq,
    selectedPo,
    onUpdateThreadDraft,
    onDeleteDraft,
    onSendReply,
    correspondenceFor,
  } = correspondenceContext
  const {
    message = {
      html_body: '',
      is_internal: 'internal',
      is_draft: true,
      uuid: '',
      subject: '',
      date_added: '',
    },
  } = route.params
  const [textMessage, setTextMessage] = useState(
    message.html_body.replace(/<[^>]+>/g, '')
  )
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

  useEffect(() => {
    return () => {}
  }, [])

  const onBack = () => {
    if (message.is_draft) {
      onUpdateThreadDraft({ uuid: message.uuid, replyValue, textMessage })
    }

    navigation.goBack()
  }

  const onDeleteConfirmation = () => {
    Alert.alert('Delete this Draft?', 'cannot be undone', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          onDeleteDraft(message.uuid)
          navigation.goBack()
        },
      },
    ])
  }

  const onSend = () => {
    onSendReply({ uuid: message.uuid, replyValue, textMessage })
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
        {message.is_draft && (
          <Appbar.Action icon='delete' onPress={onDeleteConfirmation} />
        )}

        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>

      <View style={{ padding: 20, paddingTop: 10, flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          {message.subject || 'Re: No Subject'}
        </Text>

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

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 5,
          }}
        >
          <Text style={{ fontWeight: 'bold', color: '#dbdb04', fontSize: 16 }}>
            {message.is_draft ? 'Draft' : ''}
          </Text>
          <Text style={{ color: 'gray', fontSize: 13 }}>
            {moment(message.date_added).format('MMM DD, YYYY')}
          </Text>
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
          ref={inputRef}
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

export default MessageEditable
