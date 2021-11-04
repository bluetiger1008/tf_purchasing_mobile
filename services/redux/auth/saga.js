import AsyncStorage from '@react-native-async-storage/async-storage'
import { all, fork, takeLatest, put, call } from 'redux-saga/effects'
import { showMessage, hideMessage } from 'react-native-flash-message'

import { clearToken, storeToken } from '../../helpers/utility'
import * as RootNavigation from '../../../RootNavigation'

import {
  loginAPI,
  forgotPasswordAPI,
  userUpdateAPI,
  revokeAPI,
} from '../../helpers/apis/user'
import { getApiClient } from '../../helpers/apiConfig'

import actions from './actions'

export function* loginRequest() {
  yield takeLatest(actions.LOGIN_REQUEST, function* (action) {
    const client = yield call(getApiClient)
    const { authData } = action.payload

    try {
      const res = yield call(loginAPI, authData)

      yield put({
        type: actions.SET_LOGIN_STATUS,
        payload: {
          authData,
          loginStatus: res.data,
        },
      })

      if (res.data.data.token) {
        yield call(storeToken, 'accessToken', res.data.data.token)
        yield call(storeToken, 'username', res.data.data.user.username)
        client.defaults.headers.common = {
          Authorization: `Bearer ${res.data.data.token}`,
        }
      }

      if (res.data.data.require_mfa_code) {
        RootNavigation.navigate('Authenticator')
      } else if (res.data.data.mfa_codes) {
        // yield put(push('/googleAuthenticatorQRCode'))
      } else if (res.data.data.user.force_password_change) {
        // yield put(push('/changePassword'))
      } else if (res.data.data.user.active) {
        yield put({
          type: actions.LOGIN_SUCCESS,
          payload: {
            username: res.data.data.user.username,
          },
        })

        showMessage({
          message: 'Loggedin successfully!',
          type: 'success',
          duration: 3000,
          icon: 'success',
        })
      }
    } catch (err) {
      showMessage({
        message: err.response.data.message,
        type: 'danger',
        duration: 5000,
        icon: 'danger',
      })
      // toast.error(errorMessage)

      yield put({
        type: actions.LOGIN_REJECT,
      })
    }
  })
}

export function* logoutRequest() {
  yield takeLatest(actions.LOGOUT_REQUEST, function* () {
    try {
      // yield call(revokeAPI)

      yield* clearToken()

      // toast.info('You have been logged out.')

      yield put({
        type: actions.LOGOUT_SUCCESS,
      })
    } catch {
      yield put({
        type: actions.LOGOUT_REJECT,
      })
    }
  })
}

export function* logoutSuccess() {
  // eslint-disable-next-line func-names
  yield takeLatest(actions.LOGOUT_SUCCESS, function* () {
    yield put(push('/login'))
  })
}

export function* forgotPasswordRequest() {
  yield takeLatest(actions.FORGOT_PASSWORD_REQUEST, function* (action) {
    const { userName } = action.payload

    try {
      yield call(forgotPasswordAPI, userName)

      yield put({
        type: actions.FORGOT_PASSWORD_SUCCESS,
      })
    } catch (err) {
      const errorMessage = err.response.data.message
      // toast.error(errorMessage)

      yield put({
        type: actions.FORGOT_PASSWORD_REJECT,
      })
    }
  })
}

export function* updatePasswordRequest() {
  yield takeLatest(actions.UPDATE_PASSWORD_REQUEST, function* (action) {
    const { userName, passwords } = action.payload

    try {
      yield call(userUpdateAPI, userName, {
        old_password: passwords.oldPassword,
        new_password: passwords.newPassword,
      })

      yield put({
        type: actions.UPDATE_PASSWORD_SUCCESS,
      })

      // toast.success('Password changed successfully! Login Now!')
    } catch (err) {
      const errorMessage = err.response.data.message
      // toast.error(errorMessage)

      yield put({
        type: actions.UPDATE_PASSWORD_REJECT,
      })
    }
  })
}

export default function* rootSaga() {
  yield all([
    fork(loginRequest),
    fork(logoutRequest),
    fork(forgotPasswordRequest),
    fork(updatePasswordRequest),
  ])
}
