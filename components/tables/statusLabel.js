import React from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-paper'
import _find from 'lodash/find'

const StatusLabel = ({ statusList, statusId, statusLabel }) => {
  const status = _find(statusList, { id: statusId })
  return (
    <View
      style={{
        backgroundColor: status ? status.color : '#FFF',
        padding: 5,
        borderRadius: 5,
        flexShrink: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
      }}
    >
      <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{statusLabel}</Text>
    </View>
  )
}

export default StatusLabel
