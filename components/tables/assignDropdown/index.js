import React, { useState, useEffect } from 'react'
import { Button } from 'react-native-paper'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'
import _isEqual from 'lodash/isEqual'

import adminActions from '../../../services/redux/admin/actions'

import AssignSelector from './selector'

const { updateAssignee } = adminActions

const AssignDropdown = ({
  userList,
  selected,
  permissions,
  updateFor,
  selectorStyle,
}) => {
  const dispatch = useDispatch()
  const [assignedTo, setAssignedTo] = useState(null)
  const { uuid } = selected

  const updateAssignedTo = () => {
    const { assignee } = selected

    let assignedTo = {
      type: '',
      value: '',
    }

    if (!permissions.assign) {
      if (assignee) {
        assignedTo = {
          type: 'read-only',
          value: 'Assigned',
        }
      } else {
        assignedTo = {
          type: 'read-only',
          value: 'Unassigned',
        }
      }
    } else if (permissions.assign === 'self') {
      assignedTo = {
        type: 'self',
        value: '',
      }
    } else if (permissions.assign === true) {
      if (assignee !== null) {
        assignedTo = {
          type: 'multiple',
          value: assignee.user_id,
        }
      } else {
        assignedTo = {
          type: 'multiple',
          value: '',
        }
      }
    }

    setAssignedTo(assignedTo)
  }

  useEffect(() => {
    updateAssignedTo()
  }, [])

  useEffect(() => {
    updateAssignedTo()
  }, [selected.assignee])

  const onGrab = async (uuid) => {
    dispatch(updateAssignee(uuid, updateFor, { assignee: 'self' }))
  }
  return (
    <View>
      {assignedTo && (
        <View>
          {assignedTo.type === 'read-only' && assignedTo.value}
          {assignedTo.type === 'self' && (
            <Button
              mode='contained'
              color='primary'
              onPress={() => onGrab(uuid)}
            >
              Grab
            </Button>
          )}
          {assignedTo.type === 'multiple' && userList.length > 0 && (
            <AssignSelector
              assignedTo={assignedTo}
              userList={userList}
              uuid={uuid}
              componentType='selector'
              updateFor={updateFor}
              selectorStyle={selectorStyle}
            />
          )}
        </View>
      )}
    </View>
  )
}

export default AssignDropdown
