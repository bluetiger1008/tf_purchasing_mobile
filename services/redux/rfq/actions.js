const rfqActions = {
  SAVE_AS_QUOTE: 'SAVE_AS_QUOTE',

  ON_MOVE_NONBID_ITEM: 'ON_MOVE_NONBID_ITEM',
  ON_RESET_MOVING_NONBID_ITEM: 'ON_RESET_MOVING_NONBID_ITEM',

  ON_MOVE_QUOTED_ITEM: 'ON_MOVE_QUOTED_ITEM',
  ON_RESET_MOVING_QUOTED_ITEM: 'ON_RESET_MOVING_QUOTED_ITEM',

  SET_RFQ_DATA: 'SET_RFQ_DATA',
  UNSET_RFQ_DATA: 'UNSET_RFQ_DATA',

  ON_RFQ_DELETE: 'ON_RFQ_DELETE',
  ON_RFQ_DELETE_CONFIRMED: 'ON_RFQ_DELETE_CONFIRMED',

  ON_RFQ_SEND: 'ON_RFQ_SEND',
  ON_RFQ_SEND_CONFIRMED: 'ON_RFQ_SEND_CONFIRMED',

  SET_CORRESPONDENCE_THREAD_UUID: 'SET_CORRESPONDENCE_THREAD_UUID',
  UNSET_CORRESPONDENCE_THREAD_UUID: 'UNSET_CORRESPONDENCE_THREAD_UUID',

  SET_CORRESPONDENCE_MESSAGE_UUID: 'SET_CORRESPONDENCE_MESSAGE_UUID',
  UNSET_CORRESPONDENCE_MESSAGE_UUID: 'UNSET_CORRESPONDENCE_MESSAGE_UUID',

  SET_IS_QUOTE_UPDATED: 'SET_IS_QUOTE_UPDATED',

  saveAsQuote: (correspondence) => ({
    type: rfqActions.SAVE_AS_QUOTE,
    payload: {
      correspondence,
    },
  }),

  onMoveNonbidItem: (item) => ({
    type: rfqActions.ON_MOVE_NONBID_ITEM,
    payload: {
      item,
    },
  }),

  resetMovingNonbidItem: () => ({
    type: rfqActions.ON_RESET_MOVING_NONBID_ITEM,
  }),

  onMoveQuotedItem: (item) => ({
    type: rfqActions.ON_MOVE_QUOTED_ITEM,
    payload: {
      item,
    },
  }),

  resetMovingQuotedItem: () => ({
    type: rfqActions.ON_RESET_MOVING_QUOTED_ITEM,
  }),

  setRfqData: (rfqData) => ({
    type: rfqActions.SET_RFQ_DATA,
    payload: {
      rfqData,
    },
  }),

  unsetRfqData: () => ({
    type: rfqActions.UNSET_RFQ_DATA,
  }),

  onRfqDelete: (rfqData) => ({
    type: rfqActions.ON_RFQ_DELETE,
    payload: {
      rfqData,
    },
  }),

  onRfqDeleteConfirmed: () => ({
    type: rfqActions.ON_RFQ_DELETE_CONFIRMED,
  }),

  onRfqSend: (rfqId) => ({
    type: rfqActions.ON_RFQ_SEND,
    payload: {
      rfqId,
    },
  }),

  onRfqSendConfirmed: () => ({
    type: rfqActions.ON_RFQ_SEND_CONFIRMED,
  }),

  setIsQuoteUpdated: (isQuoteUpdated) => ({
    type: rfqActions.SET_IS_QUOTE_UPDATED,
    payload: {
      isQuoteUpdated,
    },
  }),
}

export default rfqActions
