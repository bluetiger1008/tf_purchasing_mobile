import React from 'react'
import { View } from 'react-native'

import CorrespondenceList from 'components/correspondence/list'

const Correspondence = ({ selectedPo, navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <CorrespondenceList
        selectedPo={selectedPo}
        navigation={navigation}
        correspondenceFor='po'
      />
    </View>
  )
}

export default Correspondence
