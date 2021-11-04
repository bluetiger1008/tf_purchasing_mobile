import { getApiClient } from '../apiConfig'

const getPoListAPI = async (viewInfo) => {
  const client = await getApiClient()

  const searchTerm = viewInfo.searchTerm || ''
  const statuses = viewInfo.statuses ? viewInfo.statuses.join() : ''
  const users = viewInfo.users ? viewInfo.users.join() : ''
  const suppliers = viewInfo.suppliers ? viewInfo.suppliers.join() : ''

  const query = 'po/list'
  const queryPagination = `${query}?${viewInfo.pageIndex || ''}&rows=${
    viewInfo.rowsCount || ''
  }`
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

const createBatchPoLineAPI = async (rfqLines, poId) => {
  const client = await getApiClient()
  return client.post('/po/line/batch/create', {
    rfq_quote_lines: rfqLines,
    po: poId,
  })
}

const createPoLineAPI = async (poLineBody) => {
  const client = await getApiClient()
  return client.post('/po/line/create', poLineBody)
}

const updatePoLineAPI = async (poLineUUID, poLineBody) => {
  const client = await getApiClient()
  return client.put(`/po/line/update/${poLineUUID}`, poLineBody)
}

const deletePoLineAPI = async (poLineUUID) => {
  const client = await getApiClient()
  return client.delete(`/po/line/delete/${poLineUUID}`)
}

const getPoHistoryAPI = async (pouuid) => {
  const client = await getApiClient()
  return client.get(`/po/history/${pouuid}`)
}

const readPoAPI = async (uuid) => {
  const client = await getApiClient()
  return client.get(`po/read/${uuid}`)
}

const getPoCorrespondenceAPI = async (uuid) => {
  const client = await getApiClient()
  return client.get(`/po/correspondence/${uuid}`)
}

const createPoCorrespondenceAPI = async (uuid) => {
  const client = await getApiClient()
  return client.post(`/po/correspondence/create/${uuid}`)
}

const updatePoCorrespondenceAPI = async (
  messageUuid,
  { type, subject, body }
) => {
  const client = await getApiClient()
  return client.put(`/po/correspondence/update/${messageUuid}`, {
    type,
    subject,
    body,
  })
}

const updatePoAPI = async (uuid, params) => {
  const client = await getApiClient()
  if (uuid) {
    return client.put(`/po/update/${uuid}`, params)
  }
  return client.put(`/po/update`, params)
}

const deletePoAPI = async (uuid) => {
  const client = await getApiClient()
  return client.delete(`/po/delete/${uuid}`)
}

const confirmPoAPI = async (poId, messageBody) => {
  const client = await getApiClient()
  return client.put('/po/confirm', {
    po_id: poId,
    message_body: messageBody,
  })
}

const getPoMessageTemplateAPI = async (uuid) => {
  const client = await getApiClient()
  return client.get(`/po/message_template/${uuid}`)
}

const updatePoStatusAPI = async (uuid, statusId) => {
  const client = await getApiClient()
  return client.put(`/po/status/update/${uuid}`, {
    status_id: statusId,
  })
}

const batchConfirmPoAPI = async (poIds) => {
  const client = await getApiClient()
  return client.put('/po/confirm/batch', {
    id: poIds.toString(),
  })
}

const batchUpdatePoStatusAPI = async (uuids, statusId) => {
  const client = await getApiClient()
  return client.put('/po/status/update/batch', {
    status_id: statusId,
    po_uuids: uuids,
  })
}

const getPoSearchAPI = async (term, assignee, supplierId) => {
  const client = await getApiClient()
  return client.get(
    `/po/search/?term=${term}&assignee=${assignee}&supplier_id=${supplierId}`
  )
}

export {
  getPoListAPI,
  createBatchPoLineAPI,
  createPoLineAPI,
  updatePoLineAPI,
  deletePoLineAPI,
  getPoHistoryAPI,
  readPoAPI,
  updatePoAPI,
  getPoCorrespondenceAPI,
  createPoCorrespondenceAPI,
  updatePoCorrespondenceAPI,
  deletePoAPI,
  confirmPoAPI,
  getPoMessageTemplateAPI,
  updatePoStatusAPI,
  batchConfirmPoAPI,
  batchUpdatePoStatusAPI,
  getPoSearchAPI,
}
