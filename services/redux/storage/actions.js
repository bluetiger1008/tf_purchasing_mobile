const storageActions = {
  SET_REQUISITION_TABLE_SETTINGS: 'SET_REQUISITION_TABLE_SETTINGS',
  RESET_REQUISITION_TABLE_SETTINGS: 'RESET_REQUISITION_TABLE_SETTINGS',
  SET_RFQ_TABLE_SETTINGS: 'SET_RFQ_TABLE_SETTINGS',
  RESET_RFQ_TABLE_SETTINGS: 'RESET_RFQ_TABLE_SETTINGS',
  SET_PO_TABLE_SETTINGS: 'SET_PO_TABLE_SETTINGS',
  RESET_PO_TABLE_SETTINGS: 'RESET_PO_TABLE_SETTINGS',
  SET_SHIPMENTS_TABLE_SETTINGS: 'SET_SHIPMENTS_TABLE_SETTINGS',
  RESET_SHIPMENTS_TABLE_SETTINGS: 'RESET_SHIPMENTS_TABLE_SETTINGS',

  setRequisitionTableSettings: (settings) => ({
    type: storageActions.SET_REQUISITION_TABLE_SETTINGS,
    payload: {
      settings,
    },
  }),

  resetRequisitionTableSettings: () => ({
    type: storageActions.RESET_REQUISITION_TABLE_SETTINGS,
  }),

  setRfqTableSettings: (settings) => ({
    type: storageActions.SET_RFQ_TABLE_SETTINGS,
    payload: {
      settings,
    },
  }),

  resetRfqTableSettings: () => ({
    type: storageActions.RESET_RFQ_TABLE_SETTINGS,
  }),

  setPoTableSettings: (settings) => ({
    type: storageActions.SET_PO_TABLE_SETTINGS,
    payload: {
      settings,
    },
  }),

  resetPoTableSettings: () => ({
    type: storageActions.RESET_PO_TABLE_SETTINGS,
  }),

  setShipmentsTableSettings: (settings) => ({
    type: storageActions.SET_SHIPMENTS_TABLE_SETTINGS,
    payload: {
      settings,
    },
  }),

  resetShipmentsTableSettings: () => ({
    type: storageActions.RESET_SHIPMENTS_TABLE_SETTINGS,
  }),
}

export default storageActions
