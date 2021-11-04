const purchaseOrderActions = {
  FETCH_PO_READ_REQUEST: 'FETCH_PO_READ_REQUEST',
  FETCH_PO_READ_SUCCESS: 'FETCH_PO_READ_SUCCESS',
  FETCH_PO_READ_REJECT: 'FETCH_PO_READ_REJECT',

  SET_PO_DATA: 'SET_PO_DATA',
  UNSET_PO_DATA: 'UNSET_PO_DATA',

  ON_PO_DELETE: 'ON_PO_DELETE',
  ON_PO_DELETE_CONFIRMED: 'ON_PO_DELETE_CONFIRMED',

  ON_PO_SEND: 'ON_PO_SEND',
  ON_PO_SEND_CONFIRMED: 'ON_PO_SEND_CONFIRMED',

  fetchPoRead: (uuid) => ({
    type: purchaseOrderActions.FETCH_PO_READ_REQUEST,
    payload: {
      uuid,
    },
  }),

  setPoData: (poData) => ({
    type: purchaseOrderActions.SET_PO_DATA,
    payload: {
      poData,
    },
  }),

  unsetPoData: () => ({
    type: purchaseOrderActions.UNSET_PO_DATA,
  }),

  onPoDelete: (poData) => ({
    type: purchaseOrderActions.ON_PO_DELETE,
    payload: {
      poData,
    },
  }),

  onPoDeleteConfirmed: () => ({
    type: purchaseOrderActions.ON_PO_DELETE_CONFIRMED,
  }),

  onPoSend: (poId) => ({
    type: purchaseOrderActions.ON_PO_SEND,
    payload: {
      poId,
    },
  }),

  onPoSendConfirmed: () => ({
    type: purchaseOrderActions.ON_PO_SEND_CONFIRMED,
  }),
}

export default purchaseOrderActions
