// import { toast } from 'react-toastify'
import { all, fork, takeLatest, put, call } from 'redux-saga/effects'

import {
  fetchShipmentAPI,
  fetchShipmentTrackingAPI,
  fetchCarriersListAPI,
  fetchShipmentListAPI,
  readShipmentAPI,
} from '../../helpers/apis/other'
import actions from './actions'
import adminActions from '../admin/actions'

export function* fetchShipment() {
  yield takeLatest(actions.FETCH_SHIPMENT_REQUEST, function* (action) {
    const { uuid } = action.payload

    try {
      const res = yield call(fetchShipmentAPI, uuid)
      const { shipments } = res.data.data

      yield put({
        type: actions.FETCH_SHIPMENT_SUCCESSS,
        payload: {
          data: res.data.data,
        },
      })

      yield put({
        type: actions.SET_REMAINING_LINES,
        payload: {
          data: res.data.data.remaining_lines,
        },
      })

      if (shipments && shipments.length > 0) {
        yield all(
          shipments.map((shipment) =>
            fork(function* () {
              try {
                const shipmentRes = yield call(
                  fetchShipmentTrackingAPI,
                  shipment
                )

                yield put({
                  type: actions.SET_COMPLETED_SHIPMENTS,
                  payload: {
                    data: shipmentRes.data.data,
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
          )
        )
      }
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

export function* fetchShipmentList() {
  yield takeLatest(actions.FETCH_SHIPMENT_LIST_REQUEST, function* (action) {
    const { status, startDate } = action.payload

    try {
      const res = yield call(fetchShipmentListAPI, status, startDate)

      yield put({
        type: actions.FETCH_SHIPMENT_LIST_SUCCESS,
        payload: {
          data: res.data.data,
        },
      })
      // toast.success('Shipment list is loaded successfully')
    } catch (err) {
      yield put({
        type: actions.FETCH_SHIPMENT_LIST_REJECT,
      })
      yield put({
        type: adminActions.ON_API_ERROR,
        payload: {
          err,
        },
      })
    }
  })
}

export function* fetchCarriersList() {
  yield takeLatest(actions.FETCH_CARRIERS_LIST_REQUEST, function* () {
    try {
      const res = yield call(fetchCarriersListAPI)

      yield put({
        type: actions.FETCH_CARRIERS_LIST_SUCCESS,
        payload: {
          data: res.data.data,
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

export function* readShipment() {
  yield takeLatest(actions.READ_SHIPMENT_REQUEST, function* (action) {
    const { trackingNumber } = action.payload

    try {
      const res = yield call(readShipmentAPI, trackingNumber)

      yield put({
        type: actions.READ_SHIPMENT_SUCCESS,
        payload: {
          data: res.data.data,
        },
      })
      // toast.success('Shipment data is loaded successfully')
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
  yield all([
    fork(fetchShipment),
    fork(fetchCarriersList),
    fork(fetchShipmentList),
  ])
}
