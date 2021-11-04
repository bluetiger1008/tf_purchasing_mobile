import React, { useEffect } from 'react'

import MessageViewList from './messageViewList'
import MessageEditable from './messageEditable'
import MessageCreate from './messageCreate'

import { createStackNavigator } from '@react-navigation/stack'
import CorrespondenceContextProvider from './context/provider'

const Stack = createStackNavigator()

const CorrespondenceMessages = ({ navigation, route }) => {
  const { messages, subject, selectedRfq, selectedPo, correspondenceFor } =
    route.params

  return (
    <CorrespondenceContextProvider
      initialValues={{
        messages,
        subject,
        selectedRfq,
        selectedPo,
        correspondenceFor,
      }}
      navigation={navigation}
    >
      <Stack.Navigator initialRouteName={'MessageViewList'} headerMode={'none'}>
        <Stack.Screen name='MessageViewList' component={MessageViewList} />
        <Stack.Screen name='MessageEditable' component={MessageEditable} />
        <Stack.Screen name='MessageCreate' component={MessageCreate} />
      </Stack.Navigator>
    </CorrespondenceContextProvider>
  )
}

export default CorrespondenceMessages
