import React, { useState, useCallback } from 'react'
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import { Card, Text, FAB } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'
import Loader from 'components/loader'
import {
  getRfqCorrespondenceAPI,
  createRfqCorrespondenceAPI,
} from 'services/helpers/apis/rfq'

import {
  getPoCorrespondenceAPI,
  createPoCorrespondenceAPI,
} from 'services/helpers/apis/po'

const CorrespondenceList = ({
  correspondenceFor = 'rfq',
  selectedRfq,
  selectedPo,
  navigation,
}) => {
  const [correspondence, setCorrespondence] = useState(null)
  const [loading, setLoading] = useState(false)
  const [threads, setThreads] = useState([])

  const onGetCorrespondenceList = async () => {
    if (threads.length <= 0) {
      setLoading(true)
    }

    try {
      const correspondenceResponse =
        correspondenceFor === 'rfq'
          ? await getRfqCorrespondenceAPI(selectedRfq.uuid)
          : await getPoCorrespondenceAPI(selectedPo.uuid)
      setThreads(correspondenceResponse.data.data.threads)
      setCorrespondence(correspondenceResponse.data.data)
    } catch (error) {
      console.log(error, 'error')
    } finally {
      setLoading(false)
    }
  }

  const createNewMessage = async () => {
    try {
      const createThreadDraft =
        correspondenceFor === 'rfq'
          ? await createRfqCorrespondenceAPI(selectedRfq.uuid)
          : await createPoCorrespondenceAPI(selectedPo.uuid)

      navigation.navigate('CorrespondenceMessages', {
        screen: 'MessageCreate',
        params: {},
        messages: [{ ...createThreadDraft.data.data.message }],
        subject: '',
        selectedRfq,
        selectedPo,
        correspondenceFor,
      })
    } catch (e) {
      context.onApiError(e)
    } finally {
    }
  }

  useFocusEffect(
    useCallback(() => {
      ;(async () => {
        onGetCorrespondenceList()
      })()
    }, [threads])
  )

  const renderCorrespondenceListItems = ({ item, index }) => {
    const { participants, subject, status, date_last_updated } = item.thread
    return (
      <Card
        key={index}
        style={{ marginBottom: 10 }}
        onPress={() => {
          navigation.navigate('CorrespondenceMessages', {
            messages: item.messages,
            subject,
            selectedRfq,
            selectedPo,
            correspondenceFor,
            isNew: false,
          })
        }}
      >
        <Card.Content>
          <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 16 }}>
            {subject || 'No Subject'}
          </Text>
          <Text numberOfLines={1}>{date_last_updated.formatted_date}</Text>
          <Text numberOfLines={1} style={{ color: 'gray' }}>
            Participants: {participants.join(', ')}
          </Text>

          {status && (
            <Text
              numberOfLines={1}
              style={{
                color: status.color ? status.color : '#000',
                fontWeight: status.bold === true ? 'bold' : 'normal',
                marginTop: 10,
              }}
            >
              {status.status}
            </Text>
          )}
        </Card.Content>
      </Card>
    )
  }

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
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={threads}
        contentContainerStyle={styles.content}
        renderItem={renderCorrespondenceListItems}
        keyExtractor={(item, index) => index.toString()}
      />
      <FAB style={styles.fab} small icon='plus' onPress={createNewMessage} />
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
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

export default CorrespondenceList
