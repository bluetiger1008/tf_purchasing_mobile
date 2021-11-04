import actions from './actions'

const initState = {
  remainingLines: null,
  completedShipments: [],
  carriers: null,
  selected_po_uuid: null,
  shipmentUpdated: false,
  shipmentList: null,
  shipmentData: null,
}

export default function shipmentReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_SHIPMENT_REQUEST:
      return {
        ...state,
        selected_po_uuid: action.payload.uuid,
      }
    case actions.FETCH_SHIPMENT_SUCCESSS:
      return {
        ...state,
        shipmentData: action.payload.data,
      }
    case actions.SET_REMAINING_LINES:
      return {
        ...state,
        remainingLines: action.payload.data,
        completedShipments: [],
      }
    case actions.SET_COMPLETED_SHIPMENTS:
      return {
        ...state,
        completedShipments: [...state.completedShipments, action.payload.data],
      }
    case actions.FETCH_CARRIERS_LIST_SUCCESS:
      return {
        ...state,
        carriers: action.payload.data,
      }
    case actions.SHIPMENT_UPDATED:
      return {
        ...state,
        shipmentUpdated: true,
      }
    case actions.SHIPMENT_UPDATED_RESET:
      return {
        ...state,
        shipmentUpdated: false,
      }
    case actions.FETCH_SHIPMENT_LIST_SUCCESS:
      return {
        ...state,
        shipmentList: action.payload.data,
      }
    case actions.FETCH_SHIPMENT_LIST_REJECT:
      return {
        ...state,
        shipmentList: {},
      }
    default:
      return state
  }
}
