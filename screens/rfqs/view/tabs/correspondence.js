import React from 'react'
import { View } from 'react-native'

import CorrespondenceList from 'components/correspondence/list'

const Correspondence = ({ selectedRfq, navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <CorrespondenceList selectedRfq={selectedRfq} navigation={navigation} />
    </View>
  )
}

export default Correspondence
