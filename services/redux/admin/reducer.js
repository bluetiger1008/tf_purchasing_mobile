import _findIndex from 'lodash/findIndex'
import _update from 'lodash/update'
import _filter from 'lodash/filter'

import actions from './actions'

const initState = {
  userList: { users: [], addUser: false },
  bulkUpdated: false,
  bulkLoading: false,
  userData: null,
  userUpdated: false,
  assigneeUpdating: false,
  correspondence_thread_uuid: null,
  correspondence_messsage_uuid: null,
}

export default function adminReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_USER_LIST_SUCCESS:
      return {
        ...state,
        userList: action.payload.userList,
      }
    case actions.UPDATE_USER_LIST:
      return {
        ...state,
        userList: {
          ...state.userList,
          users: action.payload.users,
        },
      }
    case actions.USER_BULK_ACTION_REQUEST:
      return {
        ...state,
        bulkUpdated: false,
        bulkLoading: true,
      }
    case actions.USER_BULK_ACTION_SUCCESS: {
      const { actionType, userIds } = action.payload
      let { users } = state.userList
      userIds.map((id) => {
        const index = _findIndex(users, { id: parseInt(id, 10) })

        // eslint-disable-next-line func-names
        users = _update(users, `[${index}]`, function(n) {
          const userItem = n

          switch (actionType) {
            case 'makeActive':
              userItem.active = true
              break
            case 'makeInactive':
              userItem.active = false
              break
            case 'forceLogout':
              break
            case 'requireMFA':
              break
            default:
              return state
          }
          return userItem
        })

        return id
      })

      return {
        ...state,
        userList: {
          ...state.userList,
          users,
        },
        bulkLoading: false,
        bulkUpdated: true,
      }
    }
    case actions.USER_READ_REQUEST:
      return {
        ...state,
        userData: null,
      }
    case actions.USER_READ_SUCCESS:
      return {
        ...state,
        userData: action.payload.userData,
      }
    case actions.RESET_USER_DATA:
      return {
        ...state,
        userData: null,
      }
    case actions.USER_UPDATE_REQUEST:
      return {
        ...state,
        userUpdated: false,
      }
    case actions.USER_UPDATE_SUCCESS:
      return {
        ...state,
        userData: action.payload.userData,
        userUpdated: true,
      }
    case actions.REVOKE_SUCCESS: {
      const tokenObject = state.userData.token_object
      const filteredTokenObject = _filter(tokenObject, function(o) {
        return o.token !== action.payload.key
      })

      return {
        ...state,
        userData: {
          ...state.userData,
          token_object: filteredTokenObject,
        },
      }
    }
    case actions.REVOKE_ALL_SUCCESS: {
      return {
        ...state,
        userData: {
          ...state.userData,
          token_object: [],
        },
      }
    }
    case actions.UPDATE_ASSIGNEE_REQUEST:
      return {
        ...state,
        assigneeUpdating: true,
      }
    case actions.UPDATE_ASSIGNEE_SUCCESS:
      return {
        ...state,
        assigneeUpdating: false,
      }
    case actions.SET_CORRESPONDENCE_THREAD_UUID:
      return {
        ...state,
        correspondence_thread_uuid: action.payload.threadUUID,
      }
    case actions.UNSET_CORRESPONDENCE_THREAD_UUID:
      return {
        ...state,
        correspondence_thread_uuid: null,
      }
    case actions.SET_CORRESPONDENCE_MESSAGE_UUID:
      return {
        ...state,
        correspondence_messsage_uuid: action.payload.messageUUID,
      }
    case actions.UNSET_CORRESPONDENCE_MESSAGE_UUID:
      return {
        ...state,
        correspondence_messsage_uuid: null,
      }
    default:
      return state
  }
}
