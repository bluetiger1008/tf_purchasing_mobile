import { all, fork, takeLatest, put, call } from 'redux-saga/effects'

import actions from './actions'
import adminActions from '../admin/actions'
import { readPoAPI } from '../../helpers/apis/po'

export function* fetchPos() {
  yield takeLatest(actions.FETCH_PO_READ_REQUEST, function* (action) {
    const { uuid } = action.payload

    try {
      const res = yield call(readPoAPI, uuid)

      yield put({
        type: actions.FETCH_PO_READ_SUCCESS,
        payload: {
          poData: res.data.data,
        },
      })
    } catch (err) {
      yield put({
        type: adminActions.ON_API_ERROR,
        payload: {
          err,
        },
      })
    }
  })
}

export default function* rootSaga() {
  yield all([fork(fetchPos)])
}
