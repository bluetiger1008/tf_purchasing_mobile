import { all } from 'redux-saga/effects'

import authSagas from './auth/saga'
import adminSagas from './admin/saga'
import requisitionSagas from './requisition/saga'
import purchaseOrderSagas from './purchaseOrder/saga'
import shipmentSagas from './shipment/saga'
import rfqSagas from './rfq/saga'

export default function* rootSaga() {
  yield all([
    authSagas(),
    adminSagas(),
    requisitionSagas(),
    // purchaseOrderSagas(),
    // shipmentSagas(),
    rfqSagas(),
  ])
}
