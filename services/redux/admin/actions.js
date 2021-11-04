const adminActions = {
  FETCH_USER_LIST_REQUEST: 'FETCH_USER_LIST_REQUEST',
  FETCH_USER_LIST_SUCCESS: 'FETCH_USER_LIST_SUCCESS',
  FETCH_USER_LIST_REJECT: 'FETCH_USER_LIST_REJECT',

  UPDATE_USER_LIST: 'UPDATE_USER_LIST',

  USER_BULK_ACTION_REQUEST: 'USER_BULK_ACTIONS_REQUEST',
  USER_BULK_ACTION_SUCCESS: 'USER_BULK_ACTIONS_SUCCESS',
  USER_BULK_ACTION_REJECT: 'USER_BULK_ACTIONS_REJECT',

  USER_READ_REQUEST: 'USER_READ_REQUEST',
  USER_READ_SUCCESS: 'USER_READ_SUCCESS',
  USER_READ_REJECT: 'USER_READ_REJECT',

  RESET_USER_DATA: 'RESET_USER_DATA',

  USER_UPDATE_REQUEST: 'USER_UPDATE_REQUEST',
  USER_UPDATE_SUCCESS: 'USER_UPDATE_SUCCESS',
  USER_UPDATE_REJECT: 'USER_UPDATE_REJECT',

  CHANGE_PASSWORD_REQUEST: 'CHANGE_PASSWORD_REQUEST',
  CHANGE_PASSWORD_SUCCESS: 'CHANGE_PASSWORD_SUCCESS',
  CHANGE_PASSWORD_REJECT: 'CHANGE_PASSWORD_REJECT',

  REVOKE_REQUEST: 'REVOKE_REQUEST',
  REVOKE_SUCCESS: 'REVOKE_SUCCESS',
  REVOKE_REJECT: 'REVOKE_REJECT',

  REVOKE_ALL_REQUEST: 'REVOKE_ALL_REQUEST',
  REVOKE_ALL_SUCCESS: 'REVOKE_ALL_SUCCESS',
  REVOKE_ALL_REJECT: 'REVOKE_ALL_REJECT',

  UPDATE_ASSIGNEE_REQUEST: 'UPDATE_ASSIGNEE_REQUEST',
  UPDATE_ASSIGNEE_SUCCESS: 'UPDATE_ASSIGNEE_SUCCESS',
  UPDATE_ASSIGNEE_REJECT: 'UPDATE_ASSIGNEE_REJECT',

  ON_API_ERROR: 'ON_API_ERROR',
  ON_API_RESPONSE: 'ON_API_RESPONSE',

  SET_CORRESPONDENCE_THREAD_UUID: 'SET_CORRESPONDENCE_THREAD_UUID',
  UNSET_CORRESPONDENCE_THREAD_UUID: 'UNSET_CORRESPONDENCE_THREAD_UUID',

  SET_CORRESPONDENCE_MESSAGE_UUID: 'SET_CORRESPONDENCE_MESSAGE_UUID',
  UNSET_CORRESPONDENCE_MESSAGE_UUID: 'UNSET_CORRESPONDENCE_MESSAGE_UUID',

  fetchUserList: () => ({
    type: adminActions.FETCH_USER_LIST_REQUEST,
  }),

  updateUserList: (users) => ({
    type: adminActions.UPDATE_USER_LIST,
    payload: {
      users,
    },
  }),

  userBulkAction: (actionType, userIds) => ({
    type: adminActions.USER_BULK_ACTION_REQUEST,
    payload: {
      actionType,
      userIds,
    },
  }),

  readUser: (userName) => ({
    type: adminActions.USER_READ_REQUEST,
    payload: {
      userName,
    },
  }),

  resetUserData: () => ({
    type: adminActions.RESET_USER_DATA,
  }),

  updateUser: (userName, userData) => ({
    type: adminActions.USER_UPDATE_REQUEST,
    payload: {
      userName,
      userData,
    },
  }),

  changePassword: (userName, passwords) => ({
    type: adminActions.CHANGE_PASSWORD_REQUEST,
    payload: {
      userName,
      passwords,
    },
  }),

  revokeBrowser: (tokenObject) => ({
    type: adminActions.REVOKE_REQUEST,
    payload: {
      tokenObject,
    },
  }),

  revokeAllBrowser: (userId, self) => ({
    type: adminActions.REVOKE_ALL_REQUEST,
    payload: {
      userId,
      self,
    },
  }),

  onApiError: (err) => ({
    type: adminActions.ON_API_ERROR,
    payload: {
      err,
    },
  }),

  onApiResponse: (response) => ({
    type: adminActions.ON_API_RESPONSE,
    payload: {
      response,
    },
  }),

  updateAssignee: (uuid, updateFor, params) => ({
    type: adminActions.UPDATE_ASSIGNEE_REQUEST,
    payload: {
      uuid,
      updateFor,
      params,
    },
  }),

  setCorrespondenceThreadUUID: (threadUUID) => ({
    type: adminActions.SET_CORRESPONDENCE_THREAD_UUID,
    payload: {
      threadUUID,
    },
  }),

  unSetCorrespondenceThreadUUID: () => ({
    type: adminActions.UNSET_CORRESPONDENCE_THREAD_UUID,
  }),

  setCorrespondenceMessageUUID: (messageUUID) => ({
    type: adminActions.SET_CORRESPONDENCE_MESSAGE_UUID,
    payload: {
      messageUUID,
    },
  }),

  unsetCorrespondenceMessageUUID: () => ({
    type: adminActions.UNSET_CORRESPONDENCE_MESSAGE_UUID,
  }),
}

export default adminActions
