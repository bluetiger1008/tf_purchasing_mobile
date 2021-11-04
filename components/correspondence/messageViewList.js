import React, { useContext } from 'react'
import { StyleSheet } from 'react-native'
import { View, ScrollView, TouchableOpacity } from 'react-native'
import { Appbar, Text, Button } from 'react-native-paper'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { GlobalContext } from '../../Main'
import moment from 'moment'
import { useCorrespondenceContext } from './context'
import rfqActions from 'services/redux/rfq/actions'
import { HeaderLinkTree } from 'components'
const { saveAsQuote } = rfqActions

const MessageViewList = ({ navigation, saveAsQuote }) => {
  const context = useContext(GlobalContext)
  const correspondenceContext = useCorrespondenceContext()
  const { messages, subject, correspondenceFor } = correspondenceContext

  const onSaveQuote = () => {
    saveAsQuote(messages)
  }
  const headerName = correspondenceFor == 'rfq' ? 'RFQ' : 'Purchase Orders'
  return (
    <View style={styles.main_wrapper}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <HeaderLinkTree links={[headerName, 'Correspondence']} />
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: '#242424',
          borderBottomColor: 'gray',
          borderBottomWidth: 0.5,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF' }}>
          {subject || 'No Subject'}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {messages.map((item, index) => {
          const { display_name, is_internal, status, date_added } = item
          return (
            <TouchableOpacity
              key={item.uuid}
              onPress={() =>
                navigation.navigate('MessageEditable', { message: item })
              }
            >
              <View
                style={{
                  ...styles.item,
                  borderBottomWidth: messages.length === index + 1 ? 0 : 0.5,
                }}
              >
                <View style={styles.header}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                    By: {display_name}
                  </Text>
                  <Text style={{ color: 'gray', fontSize: 13 }}>
                    {moment(date_added.timestamp).format('MMM D, YYYY')}
                  </Text>
                </View>

                {status && (
                  <Text style={{ fontSize: 15 }}>
                    {is_internal ? 'Internal Note' : 'Message to Supplier'}{' '}
                    {'| '}
                    <Text
                      style={{
                        color: status.color ? status.color : '#000',
                        fontWeight: status.bold ? 'bold' : 'normal',
                        fontSize: 15,
                      }}
                    >
                      {status.status}
                    </Text>
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.button_row}>
          <Button
            style={{ ...styles.button, width: '55%' }}
            mode='contained'
            color='#FFF'
            icon='text-box-outline'
            onPress={() => correspondenceContext.onReply('internal_note')}
          >
            Internal Note
          </Button>
          <Button
            style={{ ...styles.button, width: '40%' }}
            mode='contained'
            color='#FFF'
            icon='reply-outline'
            onPress={() => correspondenceContext.onReply('reply')}
          >
            Reply
          </Button>
        </View>
        <Button
          style={styles.button}
          mode='contained'
          color='#FFF'
          icon='arrow-top-right-thick'
          onPress={onSaveQuote}
        >
          Convert to Quote
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  main_wrapper: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 0,
    backgroundColor: '#FFF',
  },
  item: {
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    marginBottom: 7,
    padding: 2,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 4,
  },
  button: {
    marginVertical: 5,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  button_row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
})
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      saveAsQuote,
    },
    dispatch
  )

export default connect(null, mapDispatchToProps)(MessageViewList)
