import actions from './actions'

const initState = {
  quoted_correspondence: null,
  moving_nonbid_item: null,
  moving_quoted_item: null,
  selected_rfq: null,
  deleted_rfq: null,
  sent_rfq_id: null,
  is_quote_updated: false,
}

export default function rfqReducer(state = initState, action) {
  switch (action.type) {
    case actions.SAVE_AS_QUOTE:
      return {
        ...state,
        quoted_correspondence: action.payload.correspondence,
      }
    case actions.ON_MOVE_NONBID_ITEM:
      return {
        ...state,
        moving_nonbid_item: action.payload.item,
      }
    case actions.ON_RESET_MOVING_NONBID_ITEM:
      return {
        ...state,
        moving_nonbid_item: null,
      }
    case actions.ON_MOVE_QUOTED_ITEM:
      return {
        ...state,
        moving_quoted_item: action.payload.item,
      }
    case actions.ON_RESET_MOVING_QUOTED_ITEM:
      return {
        ...state,
        moving_quoted_item: null,
      }
    case actions.SET_RFQ_DATA:
      return {
        ...state,
        selected_rfq: action.payload.rfqData,
      }
    case actions.UNSET_RFQ_DATA:
      return {
        ...state,
        selected_rfq: null,
      }
    case actions.ON_RFQ_DELETE:
      return {
        ...state,
        deleted_rfq: action.payload.rfqData,
      }
    case actions.ON_RFQ_DELETE_CONFIRMED:
      return {
        ...state,
        deleted_rfq: null,
      }
    case actions.ON_RFQ_SEND:
      return {
        ...state,
        sent_rfq_id: action.payload.rfqId,
      }
    case actions.ON_RFQ_SEND_CONFIRMED:
      return {
        ...state,
        sent_rfq_id: null,
      }
    case actions.SET_IS_QUOTE_UPDATED:
      return {
        ...state,
        is_quote_updated: action.payload.isQuoteUpdated,
      }
    default:
      return state
  }
}
