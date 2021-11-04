import moment from 'moment'

import actions from './actions'

const initState = {
  requisitionTableSettings: {
    sort: null,
    filter: {
      users: [],
      statuses: [],
    },
    tableViewInfo: {
      totalRows: 0,
      pageIndex: 1,
      rowsCount: 25,
    },
  },
  rfqTableSettings: {
    sort: null,
    filter: {
      suppliers: [],
      statuses: [],
      users: [],
    },
    tableViewInfo: {
      totalRows: 0,
      pageIndex: 1,
      rowsCount: 25,
    },
  },
  poTableSettings: {
    sort: null,
    filter: {
      suppliers: [],
      statuses: [],
      users: [],
    },
    tableViewInfo: {
      totalRows: 0,
      pageIndex: 1,
      rowsCount: 25,
    },
  },
  shipmentsTableSettings: {
    sort: null,
    filter: {
      statuses: [],
      startDate: moment().subtract(1, 'years'),
      endDate: moment(),
    },
    tableViewInfo: {
      totalRows: 0,
      pageIndex: 1,
      rowsCount: 25,
    },
  },
}

export default function storageReducer(state = initState, action) {
  switch (action.type) {
    case actions.SET_REQUISITION_TABLE_SETTINGS:
      return {
        ...state,
        requisitionTableSettings: {
          ...state.requisitionTableSettings,
          ...action.payload.settings,
        },
      }
    case actions.RESET_REQUISITION_TABLE_SETTINGS:
      return {
        ...state,
        requisitionTableSettings: {
          sort: null,
          filter: {
            users: [],
            statuses: [],
          },
          tableViewInfo: {
            totalRows: 0,
            pageIndex: 1,
            rowsCount: 10,
          },
        },
      }
    case actions.SET_RFQ_TABLE_SETTINGS:
      return {
        ...state,
        rfqTableSettings: {
          ...state.rfqTableSettings,
          ...action.payload.settings,
        },
      }
    case actions.RESET_RFQ_TABLE_SETTINGS:
      return {
        ...state,
        rfqTableSettings: {
          sort: null,
          filter: {
            suppliers: [],
            statuses: [],
            users: [],
          },
          tableViewInfo: {
            totalRows: 0,
            pageIndex: 1,
            rowsCount: 10,
          },
        },
      }
    case actions.SET_PO_TABLE_SETTINGS:
      return {
        ...state,
        poTableSettings: {
          ...state.poTableSettings,
          ...action.payload.settings,
        },
      }
    case actions.RESET_PO_TABLE_SETTINGS:
      return {
        ...state,
        poTableSettings: {
          sort: null,
          filter: {
            suppliers: [],
            statuses: [],
            users: [],
          },
          tableViewInfo: {
            totalRows: 0,
            pageIndex: 1,
            rowsCount: 10,
          },
        },
      }
    case actions.SET_SHIPMENTS_TABLE_SETTINGS:
      return {
        ...state,
        shipmentsTableSettings: {
          ...state.shipmentsTableSettings,
          ...action.payload.settings,
        },
      }
    case actions.RESET_SHIPMENTS_TABLE_SETTINGS:
      return {
        ...state,
        shipmentsTableSettings: {
          sort: null,
          filter: {
            status: '',
            timeframe: '',
          },
          tableViewInfo: {
            totalRows: 0,
            pageIndex: 1,
            rowsCount: 10,
          },
        },
      }
    default:
      return state
  }
}
