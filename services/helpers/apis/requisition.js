import { getApiClient } from '../apiConfig'

const readRequisitionAPI = async (uuid) => {
  const client = await getApiClient()
  return client.get(`/requisitions/read/${uuid}`)
}

const getRequisitionsSearchAPI = async (term, assignee, status) => {
  const client = await getApiClient()
  return client.get(
    `/requisitions/search/?term=${term}&assignee=${assignee}&status=${status}`
  )
}

const getRequisitionListAPI = async (viewInfo) => {
  const client = await getApiClient()

  const searchTerm = viewInfo.searchTerm || ''
  const statuses = viewInfo.statuses ? viewInfo.statuses.join() : ''
  const users = viewInfo.users ? viewInfo.users.join() : ''

  const query = 'requisitions/list'
  const queryPagination = `${query}?page=${viewInfo.pageIndex}&rows=${viewInfo.rowsCount}`
  const queryAllFilter = `${queryPagination}&status_id=${statuses}&assignee=${users}&search=${searchTerm}`
  let finalQuery = query
 
  if (statuses || users || searchTerm) {
    finalQuery = queryAllFilter
  } else if (!viewInfo) {
    finalQuery = query
  } else {
    finalQuery = queryPagination
  }

  console.log('final query', finalQuery)
  return client.get(finalQuery)
}

const updateRequisitionAPI = async (uuid, params) => {
  const client = await getApiClient()
  if (uuid) {
    return client.put(`/requisitions/update/${uuid}`, params)
  }
  return client.put(`/requisitions/update`, params)
}

const batchUpdateStatusAPI = async (uuids, statusId) => {
  const client = await getApiClient()
  return client.put('/requisitions/status/update/batch', {
    status_id: statusId,
    requisition_uuids: uuids,
  })
}

const getRequisitionPriceHistoryAPI = async (uuid) => {
  const client = await getApiClient()
  return client.get(`/requisitions/price_history/${uuid}`)
}

const getRequisitionInventoryAPI = async (uuid) => {
  const client = await getApiClient()
  return client.get(`/requisitions/inventory/${uuid}`)
}

const getRequisitionRfqpoAPI = async (uuid, cancelToken) => {
  const client = await getApiClient()
  return client.get(`/requisitions/rfqpo/${uuid}`, {
    cancelToken,
  })
}

const getRequisitionShipmentsAPI = async (uuid) => {
  const client = await getApiClient()
  return client.get(`/requisitions/shipments/${uuid}`)
}

const getRequisitionHistoryAPI = async (uuid) => {
  const client = await getApiClient()
  return client.get(`/requisitions/history/${uuid}`)
}

export {
  readRequisitionAPI,
  getRequisitionListAPI,
  getRequisitionsSearchAPI,
  updateRequisitionAPI,
  getRequisitionPriceHistoryAPI,
  getRequisitionInventoryAPI,
  getRequisitionRfqpoAPI,
  getRequisitionShipmentsAPI,
  getRequisitionHistoryAPI,
  batchUpdateStatusAPI,
}
