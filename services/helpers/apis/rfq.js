import { getApiClient } from '../apiConfig'

const client = getApiClient()

const createRfqAPI = async (supplierID) => {
  const client = await getApiClient()
  return client.post('/rfq/create', {
    supplier_id: supplierID,
  })
}

const updateRfqAPI = async (uuid, params) => {
  const client = await getApiClient()
  if (uuid) {
    return client.put(`/rfq/update/${uuid}`, params)
  }
  return client.put(`/rfq/update`, params)
}

const createRfqLineAPI = async (rfqBody) => {
  const client = await getApiClient()
  return client.post('/rfq/line/create', rfqBody)
}

const createRfqLineBatchAPI = (rfqId, requisitionIds) => {
  return client.post('/rfq/line/create/batch', {
    rfq_id: rfqId,
    requisition_ids: requisitionIds,
  })
}

const confirmRfqAPI = async (rfqId, messageBody) => {
  const client = await getApiClient()
  return client.put('/rfq/confirm', {
    rfq_id: rfqId,
    message_body: messageBody,
  })
}

const batchConfirmRfqAPI = (rfqIds) => {
  return client.put('/rfq/confirm/batch', {
    id: rfqIds.toString(),
  })
}

const getRfqListApi = async (viewInfo) => {
  const client = await getApiClient()

  const searchTerm = viewInfo.searchTerm || ''
  const statuses = viewInfo.statuses ? viewInfo.statuses.join() : ''
  const users = viewInfo.users ? viewInfo.users.join() : ''
  const suppliers = viewInfo.suppliers ? viewInfo.suppliers.join() : ''

  const query = 'rfq/list'
  const queryPagination = `${query}?${viewInfo.pageIndex}&rows=${viewInfo.rowsCount}`
  const queryAllFilter = `${queryPagination}&status_id=${statuses}&assignee=${users}&supplier_id=${suppliers}&search=${searchTerm}`
  let finalQuery = query

  if (statuses || users || suppliers || searchTerm) {
    finalQuery = queryAllFilter
  } else if (!viewInfo) {
    finalQuery = query
  } else {
    finalQuery = queryPagination
  }

  return client.get(finalQuery)
}

const getRfqDraftAPI = async (supplierID) => {
  const client = await getApiClient()
  return client.get(`/rfq/list/draft?supplier_id=${supplierID}`)
}

const getRfqSearchAPI = (term, assignee, supplierId) => {
  return client.get(
    `/rfq/search/?term=${term}&assignee=${assignee}&supplier_id=${supplierId}`
  )
}

const readRfqAPI = async (uuid) => {
  const client = await getApiClient()
  return client.get(`/rfq/read/${uuid}`)
}

const deleteRfqAPI = async (uuid) => {
  const client = await getApiClient()
  return client.delete(`/rfq/delete/${uuid}`)
}

const getRfqCorrespondenceAPI = async (uuid) => {
  const client = await getApiClient()
  return client.get(`/rfq/correspondence/${uuid}`)
}

const createRfqQuoteAPI = async (quoteBody) => {
  const client = await getApiClient()
  return client.post('/rfq/quote/create', quoteBody)
}

const getRfqQuoteAPI = async (uuid) => {
  const client = await getApiClient()
  return client.get(`/rfq/quote/read/${uuid}`)
}

const updateRfqQuoteAPI = async (quoteLineUUID, updateBody) => {
  const client = await getApiClient()
  return client.put(`rfq/quote/update/${quoteLineUUID}`, updateBody)
}

const addRfqQuoteAPI = (uuid, rfqLine) => {
  return client.post(`rfq/quote/add/${uuid}`, rfqLine)
}

const deleteRfqQuoteAPI = async (quoteLineUUID) => {
  const client = await getApiClient()
  return client.delete(`rfq/quote/delete/${quoteLineUUID}`)
}

const getRfqHistoryAPI = async (uuid) => {
  const client = await getApiClient()
  return client.get(`/rfq/history/${uuid}`)
}

const getRfqMessageTemplateAPI = async (rfqId) => {
  const client = await getApiClient()
  return client.get(`/rfq/message_template/${rfqId}`)
}

const cancelRfqLineAPI = async (uuid) => {
  const client = await getApiClient()
  return client.delete(`rfq/line/cancel/${uuid}`)
}

const deleteRfqLineAPI = async (uuid) => {
  const client = await getApiClient()
  return client.delete(`/rfq/line/delete/${uuid}`)
}

const updateRfqLineAPI = async (uuid, lineBody) => {
  const client = await getApiClient()
  return client.put(`/rfq/line/update/${uuid}`, lineBody)
}

const createRfqCorrespondenceAPI = async (uuid) => {
  const client = await getApiClient()
  return client.post(`/rfq/correspondence/create/${uuid}`)
}

const updateRfqCorrespondenceAPI = async (
  messageUuid,
  { type, subject, body }
) => {
  const client = await getApiClient()
  return client.put(`/rfq/correspondence/update/${messageUuid}`, {
    type,
    subject,
    body,
  })
}

const getRfqStatusesAPI = () => {
  return client.get(`/rfq/status/list`)
}

const updateRfqStatusAPI = async (uuid, statusId) => {
  const client = await getApiClient()
  return client.put(`/rfq/status/update/${uuid}`, {
    status_id: statusId,
  })
}

const batchUpdateRfqStatusAPI = (uuids, statusId) => {
  return client.put('/rfq/status/update/batch', {
    status_id: statusId,
    rfq_uuids: uuids,
  })
}

const updateRfqQuoteRatingAPI = async (uuid, rating) => {
  const client = await getApiClient()
  return client.put(`/rfq/quote/rating/${rating}/${uuid}`)
}

const updateRfqQuotePauseAPI = async (uuid, toggle) => {
  const client = await getApiClient()
  return client.put(`/rfq/quote/pause/${toggle}/${uuid}`)
}

const finalizeRfqQuoteAPI = async (uuid) => {
  const client = await getApiClient()
  return client.put(`/rfq/quote/finalize/${uuid}`)
}

export {
  createRfqAPI,
  createRfqLineAPI,
  createRfqLineBatchAPI,
  updateRfqAPI,
  confirmRfqAPI,
  batchConfirmRfqAPI,
  getRfqListApi,
  getRfqSearchAPI,
  getRfqDraftAPI,
  readRfqAPI,
  deleteRfqAPI,
  getRfqCorrespondenceAPI,
  createRfqQuoteAPI,
  getRfqQuoteAPI,
  updateRfqQuoteAPI,
  addRfqQuoteAPI,
  deleteRfqQuoteAPI,
  getRfqHistoryAPI,
  getRfqMessageTemplateAPI,
  cancelRfqLineAPI,
  deleteRfqLineAPI,
  updateRfqLineAPI,
  createRfqCorrespondenceAPI,
  updateRfqCorrespondenceAPI,
  getRfqStatusesAPI,
  updateRfqStatusAPI,
  updateRfqQuoteRatingAPI,
  updateRfqQuotePauseAPI,
  finalizeRfqQuoteAPI,
  batchUpdateRfqStatusAPI,
}
