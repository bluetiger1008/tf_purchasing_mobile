import { all, fork, takeLatest, put, call } from 'redux-saga/effects'

import actions from './actions'
import adminActions from '../admin/actions'
import { fetchCarriersServicesAPI } from '../../helpers/apis/other'
import { fetchSuppliersAPI } from '../../helpers/apis/supplier'
import { readRequisitionAPI } from '../../helpers/apis/requisition'

export function* fetchSuppliers() {
  yield takeLatest(actions.FETCH_SUPPLIERS_REQUEST, function* () {
    try {
      const res = yield call(fetchSuppliersAPI)

      yield put({
        type: actions.FETCH_SUPPLIERS_SUCCESS,
        payload: {
          suppliersList: res.data.data,
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

export function* fetchCarriers() {
  yield takeLatest(actions.FETCH_CARRIERS_REQUEST, function* () {
    try {
      const res = yield call(fetchCarriersServicesAPI)

      yield put({
        type: actions.FETCH_CARRIERS_SUCCESS,
        payload: {
          carriersList: res.data.data,
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

export function* readRequisition() {
  yield takeLatest(actions.READ_REQUISITION_REQUEST, function* (action) {
    const { uuid } = action.payload

    try {
      const res = yield call(readRequisitionAPI, uuid)

      yield put({
        type: actions.READ_REQUISITION_SUCCESS,
        payload: {
          requisition: res.data.data,
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
  yield all([fork(fetchSuppliers), fork(fetchCarriers), fork(readRequisition)])
}
