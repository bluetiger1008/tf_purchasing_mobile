import actions from './actions'

const initState = {
  poData: null,
  selected_po: null,
  sent_po_id: null,
  deleted_po: null,
}

export default function purchaseOrderReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_PO_READ_SUCCESS:
      return {
        ...state,
        poData: action.payload.poData,
      }
    case actions.SET_PO_DATA:
      return {
        ...state,
        selected_po: action.payload.poData,
      }
    case actions.UNSET_PO_DATA:
      return {
        ...state,
        selected_po: null,
      }
    case actions.ON_PO_DELETE:
      return {
        ...state,
        deleted_po: action.payload.poData,
      }
    case actions.ON_PO_DELETE_CONFIRMED:
      return {
        ...state,
        deleted_po: null,
      }
    case actions.ON_PO_SEND:
      return {
        ...state,
        sent_po_id: action.payload.poId,
      }
    case actions.ON_PO_SEND_CONFIRMED:
      return {
        ...state,
        sent_po_id: null,
      }
    default:
      return state
  }
}
