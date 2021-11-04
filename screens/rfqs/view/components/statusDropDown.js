import React, { useState, useContext } from 'react'
import { Button } from 'react-native-paper'
import { View, Picker } from 'react-native'
// import Menu from '@material-ui/core/Menu'
// import MenuItem from '@material-ui/core/MenuItem'
import _find from 'lodash/find'
import { useDispatch } from 'react-redux'

import adminActions from '../../../../services/redux/admin/actions'
import { updateRfqStatusAPI } from 'services/helpers/apis/rfq'
import { updatePoStatusAPI } from 'services/helpers/apis/po'
import { GlobalContext } from '../../../../Main'

const AssignSelector = ({
  statuses,
  statusId,
  uuid,
  onStatusUpdated,
  statusFor,
  selectorStyle,
  selectorTextStyle,
}) => {
  const context = useContext(GlobalContext)
  const [selectedStatus, setSelectedStatus] = useState(statusId)

  const onSelectStatus = async (id) => {
    try {
      if (statusFor === 'rfq') await updateRfqStatusAPI(uuid, id)
      else await updatePoStatusAPI(uuid, id)
      setSelectedStatus(id)
      context.onApiSuccess('Status Updated')
      onStatusUpdated()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <View
      style={{
        borderBottomColor: '#dedede',
        borderBottomWidth: 0.5,
        ...selectorStyle,
      }}
    >
      <Picker
        selectedValue={selectedStatus}
        style={{
          height: 40,
          fontSize: 10,
          ...selectorTextStyle,
          minWidth: 100,
        }}
        itemStyle={{ width: 'auto' }}
        onValueChange={onSelectStatus}
      >
        {statuses.map((status, i) => (
          <Picker.Item label={status.status} value={status.id} key={i} />
        ))}
      </Picker>
    </View>
  )
}

export default AssignSelector
