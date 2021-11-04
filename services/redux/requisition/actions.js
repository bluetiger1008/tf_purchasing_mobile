const requisitionActions = {
  FETCH_SUPPLIERS_REQUEST: 'FETCH_SUPPLIERS_REQUEST',
  FETCH_SUPPLIERS_SUCCESS: 'FETCH_SUPPLIERS_SUCCESS',
  FETCH_SUPPLIERS_REJECT: 'FETCH_SUPPLIERS_REJECT',

  FETCH_CARRIERS_REQUEST: 'FETCH_CARRIERS_REQUEST',
  FETCH_CARRIERS_SUCCESS: 'FETCH_CARRIERS_SUCCESS',
  FETCH_CARRIERS_REJECT: 'FETCH_CARRIERS_REJECT',

  TOGGLE_SEND_PURCHASE_MODAL: 'TOGGLE_SEND_PURCHASE_MODAL',

  READ_REQUISITION_REQUEST: 'READ_REQUISITION_REQUEST',
  READ_REQUISITION_SUCCESS: 'READ_REQUISITION_SUCCESS',
  READ_REQUISITION_REJECT: 'READ_REQUISITION_REJECT',

  SET_SELECTED_REQUISITION: 'SET_SELECTED_REQUISITION',
  SET_PRICE_HISTORY: 'SET_PRICE_HISTORY',

  fetchSuppliers: () => ({
    type: requisitionActions.FETCH_SUPPLIERS_REQUEST,
  }),

  fetchCarriers: () => ({
    type: requisitionActions.FETCH_CARRIERS_REQUEST,
  }),

  toggleSendPurchaseModal: (visible, content = '', poId = null) => ({
    type: requisitionActions.TOGGLE_SEND_PURCHASE_MODAL,
    payload: {
      visible,
      content,
      poId,
    },
  }),

  readRequisition: (uuid) => ({
    type: requisitionActions.READ_REQUISITION_REQUEST,
    payload: {
      uuid,
    },
  }),

  setSelectedRequisition: (requisition) => ({
    type: requisitionActions.SET_SELECTED_REQUISITION,
    payload: {
      requisition,
    },
  }),

  setPriceHistory: (history) => ({
    type: requisitionActions.SET_PRICE_HISTORY,
    payload: {
      history,
    },
  }),
}

export default requisitionActions
