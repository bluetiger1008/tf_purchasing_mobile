import React, { useEffect, useState } from 'react'
import { Button } from 'react-native-paper'
import { View, Picker } from 'react-native'
import _find from 'lodash/find'
import { useDispatch } from 'react-redux'
import { SinglePicker } from 'components'

import adminActions from '../../../services/redux/admin/actions'

const { updateAssignee } = adminActions

const AssignSelector = ({
  assignedTo,
  userList,
  componentType,
  uuid,
  updateFor,
  selectorStyle,
}) => {
  const dispatch = useDispatch()
  const [assignedValue, setAssignedValue] = useState(assignedTo.value)
  const [assignedUser, setAssignedUser] = useState(null)

  useEffect(() => {
    setAssignedValue(assignedTo.value)
  }, [assignedTo])

  useEffect(() => {
    if (componentType === 'menu') {
      const assignedUser = _find(userList, { id: assignedTo.value })
      setAssignedUser(assignedUser)
    }
  }, [])

  const changeAssignee = (value) => {
    setAssignedValue(value)
    dispatch(updateAssignee(uuid, updateFor, { assignee: value }))
    if (componentType === 'menu') {
      const assignedUser = _find(userList, { id: value })
      setAssignedUser(assignedUser)
    }
  }

  const handleChange = (itemValue, itemIndex) => {
    changeAssignee(itemValue)
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleSelectMenuItem = (id) => {
    changeAssignee(id)
  }

  return (
    <>
      {componentType === 'selector' && (
        <SinglePicker
          style={{ marginVertical: 5, ...selectorStyle }}
          list={userList}
          id='id'
          label='name'
          selectedValue={assignedValue}
          onChangeValue={(value) => handleChange(value.id)}
        />
      )}
    </>
  )
}

export default AssignSelector
