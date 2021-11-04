import React, { useContext } from 'react'
import { Avatar, Text } from 'react-native-paper'
import { View } from 'react-native'

const RequisitionQuickGlance = ({ row }) => {
  return (
    <Text style={{ marginTop: 10, marginBottom: 10 }}>
      <View style={{ flexDirection: 'row' }}>
        <Avatar.Text
          label='PN'
          style={{
            backgroundColor: row.pn_icon.icon_color,
            marginRight: 10,
          }}
        />
        <Avatar.Text
          label='SP'
          style={{
            backgroundColor: row.sp_icon.icon_color,
          }}
        />
      </View>
    </Text>
  )
}

export default RequisitionQuickGlance
