import { all, fork, takeLatest, put, call } from 'redux-saga/effects'
// import { toast } from 'react-toastify'

import { updateRequisitionAPI } from '../../helpers/apis/requisition'
import { updateRfqAPI } from '../../helpers/apis/rfq'
import { updatePoAPI } from '../../helpers/apis/po'

import authActions from '../auth/actions'
import actions from './actions'
import {
  fetchUserListAPI,
  bulkUserMakeActiveAPI,
  bulkUserMakeInactiveAPI,
  bulkUserForceLogoutAPI,
  bulkUserAddMFAAPI,
  userReadAPI,
  userUpdateAPI,
  revokeAPI,
  forceLogoutAPI,
} from '../../helpers/apis/user'
// import { clearToken } from '../../helpers/utility'

export function* onApiError() {
  yield takeLatest(actions.ON_API_ERROR, function* (action) {
    const { err } = action.payload
    let errorMessage

    if (err.response.data.code === 401) {
      // clearToken()
      yield put({
        type: authActions.LOGOUT_SUCCESS,
      })
    } else {
      errorMessage = err.response.data.message
    }

    // toast.error(errorMessage)
  })
}

export function* onApiResponse() {
  yield takeLatest(actions.ON_API_RESPONSE, function (action) {
    const { response } = action.payload

    if (response.data.code === 200 || response.data.code === 201) {
      // toast.success('Success')
    } else if (response.data.code >= 400 && response.data.code < 600) {
      // toast.warn(response.data.message)
    }
  })
}

export function* fetchUserListRequest() {
  yield takeLatest(actions.FETCH_USER_LIST_REQUEST, function* () {
    try {
      const res = yield call(fetchUserListAPI)

      yield put({
        type: actions.FETCH_USER_LIST_SUCCESS,
        payload: {
          userList: res.data.data,
        },
      })
    } catch (err) {
      yield put({
        type: actions.FETCH_USER_LIST_REJECT,
      })
      yield put({
        type: actions.ON_API_ERROR,
        payload: {
          err,
        },
      })
    }
  })
}

export function* userBulkActionRequest() {
  yield takeLatest(actions.USER_BULK_ACTION_REQUEST, function* (action) {
    const { actionType, userIds } = action.payload

    try {
      if (actionType === 'makeActive') {
        yield call(bulkUserMakeActiveAPI, userIds)
      } else if (actionType === 'makeInactive') {
        yield call(bulkUserMakeInactiveAPI, userIds)
      } else if (actionType === 'forceLogout') {
        yield call(bulkUserForceLogoutAPI, userIds)
      } else if (actionType === 'requireMFA') {
        yield call(bulkUserAddMFAAPI, userIds)
      }

      // toast.success('Updated Successfully!')
      yield put({
        type: actions.USER_BULK_ACTION_SUCCESS,
        payload: {
          actionType,
          userIds,
        },
      })
    } catch (err) {
      yield put({
        type: actions.USER_BULK_ACTION_REJECT,
      })
      yield put({
        type: actions.ON_API_ERROR,
        payload: {
          err,
        },
      })
    }
  })
}

export function* userReadRequest() {
  yield takeLatest(actions.USER_READ_REQUEST, function* (action) {
    const { userName } = action.payload

    try {
      const res = yield call(userReadAPI, userName)

      yield put({
        type: actions.USER_READ_SUCCESS,
        payload: {
          userData: res.data.data,
        },
      })
    } catch (err) {
      yield put({
        type: actions.USER_READ_REJECT,
      })

      yield put({
        type: actions.ON_API_ERROR,
        payload: {
          err,
        },
      })
    }
  })
}

export function* userUpdateRequest() {
  yield takeLatest(actions.USER_UPDATE_REQUEST, function* (action) {
    const { userName, userData } = action.payload

    try {
      const res = yield call(userUpdateAPI, userName, userData)

      if (res.data.code === 201) {
        // toast.success('User updated successfully!')
      } else {
        // toast.warn(res.data.message)
      }
      yield put({
        type: actions.USER_UPDATE_SUCCESS,
        payload: {
          userData: res.data.data.user,
        },
      })
    } catch (err) {
      yield put({
        type: actions.ON_API_ERROR,
        payload: {
          err,
        },
      })

      yield put({
        type: actions.USER_UPDATE_REJECT,
      })
    }
  })
}

export function* changePasswordRequest() {
  yield takeLatest(actions.CHANGE_PASSWORD_REQUEST, function* (action) {
    const { userName, passwords } = action.payload

    try {
      const res = yield call(userUpdateAPI, userName, passwords)

      // toast.success('User updated successfully!')
      yield put({
        type: actions.CHANGE_PASSWORD_SUCCESS,
        payload: {
          userData: res.data.data.user,
        },
      })
    } catch (err) {
      yield put({
        type: actions.ON_API_ERROR,
        payload: {
          err,
        },
      })

      yield put({
        type: actions.CHANGE_PASSWORD_REJECT,
      })
    }
  })
}

export function* revokeRequest() {
  yield takeLatest(actions.REVOKE_REQUEST, function* (action) {
    const { tokenObject } = action.payload

    try {
      yield call(revokeAPI, tokenObject.token)

      // toast.success('Revoked successfully!')

      yield put({
        type: actions.REVOKE_SUCCESS,
        payload: {
          key: tokenObject.token,
        },
      })
    } catch (err) {
      yield put({
        type: actions.ON_API_ERROR,
        payload: {
          err,
        },
      })
    }
  })
}

export function* revokeAllRequest() {
  yield takeLatest(actions.REVOKE_ALL_REQUEST, function* (action) {
    const { userId, self } = action.payload

    try {
      const res = yield call(forceLogoutAPI, userId)

      if (res.data.code === 201) {
        if (self) {
          // yield* clearToken()
          yield put(authActions.logout())
          // toast.info('You have been logged out.')
        } else {
          // toast.success('Revoked All Successfully')
        }
      } else {
        // toast.warn(res.data.message)
      }

      yield put({
        type: actions.REVOKE_ALL_SUCCESS,
      })
    } catch (err) {
      yield put({
        type: actions.ON_API_ERROR,
        payload: {
          err,
        },
      })
    }
  })
}

export function* updateAssignee() {
  yield takeLatest(actions.UPDATE_ASSIGNEE_REQUEST, function* (action) {
    const { uuid, updateFor, params } = action.payload

    try {
      if (updateFor === 'requisition') {
        yield call(updateRequisitionAPI, uuid, params)
      } else if (updateFor === 'rfq') {
        yield call(updateRfqAPI, uuid, params)
      } else if (updateFor === 'po') {
        yield call(updatePoAPI, uuid, params)
      }

      yield put({
        type: actions.UPDATE_ASSIGNEE_SUCCESS,
      })
      // toast.success('Assigned Successfully')
    } catch (err) {
      yield put({
        type: actions.ON_API_ERROR,
        payload: {
          err,
        },
      })
    }
  })
}

export default function* rootSaga() {
  yield all([
    fork(fetchUserListRequest),
    fork(userBulkActionRequest),
    fork(userReadRequest),
    fork(userUpdateRequest),
    fork(changePasswordRequest),
    fork(revokeRequest),
    fork(revokeAllRequest),
    fork(onApiError),
    fork(onApiResponse),
    fork(updateAssignee),
  ])
}
