import actions from './actions'

const initState = {
  suppliersList: [],
  carriersList: [],
  showSendPurchaseModal: false,
  purchaseMessageTemplate: '',
  poId: null,
  selectedRequisition: null,
  priceHistory: null,
}

export default function requisitionReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_SUPPLIERS_SUCCESS:
      return {
        ...state,
        suppliersList: action.payload.suppliersList,
      }
    case actions.FETCH_CARRIERS_SUCCESS:
      return {
        ...state,
        carriersList: action.payload.carriersList,
      }
    case actions.TOGGLE_SEND_PURCHASE_MODAL:
      return {
        ...state,
        showSendPurchaseModal: action.payload.visible,
        purchaseMessageTemplate: action.payload.content,
        poId: action.payload.poId,
      }
    case actions.READ_REQUISITION_SUCCESS:
    case actions.SET_SELECTED_REQUISITION:
      return {
        ...state,
        selectedRequisition: action.payload.requisition,
      }
    case actions.SET_PRICE_HISTORY:
      return {
        ...state,
        priceHistory: action.payload.history,
      }
    default:
      return state
  }
}
