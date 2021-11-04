import React, { useState, useContext, useEffect } from 'react'
import { View, Picker } from 'react-native'
import _find from 'lodash/find'

import { updateRfqStatusAPI } from 'services/helpers/apis/rfq'
import { updatePoStatusAPI } from 'services/helpers/apis/po'
import { GlobalContext } from '../../Main'
import { SinglePicker } from 'components'

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

  useEffect(() => {
    if (statusId !== undefined) {
      setSelectedStatus(statusId)
    }
  }, [statusId])

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

  const validStatuses = statuses.filter((item) => item.disabled === false)

  return (
    <SinglePicker
      style={{ marginBottom: 10, ...selectorStyle }}
      textStyle={selectorTextStyle}
      arrowColor='#FFF'
      list={validStatuses}
      id='id'
      label='status'
      selectedValue={selectedStatus}
      onChangeValue={(value) => onSelectStatus(value.id)}
    />
  )
}

export default AssignSelector
