import { getApiClient } from '../apiConfig'

const fetchShipmentListAPI = async (viewInfo) => {
  const client = await getApiClient()

  const searchTerm = viewInfo.searchTerm || ''
  const statuses = viewInfo.statuses ? viewInfo.statuses.join() : ''

  const query = 'shipment/list'
  const queryPagination = `${query}?${viewInfo.pageIndex}&rows=${viewInfo.rowsCount}`
  const queryAllFilter = `${queryPagination}&status=${statuses}&search=${searchTerm}`
  let finalQuery = query

  if (statuses || searchTerm) {
    finalQuery = queryAllFilter
  } else if (!viewInfo) {
    finalQuery = query
  } else {
    finalQuery = queryPagination
  }

  return client.get(finalQuery)
}

const fetchShipmentStatusListAPI = async () => {
  const client = await getApiClient()
  return client.get('/shipment/status/list')
}

const readShipmentByTrackingNumberAPI = async (trackingNumber) => {
  const client = await getApiClient()
  return client.get('/shipment/read/' + trackingNumber)
}

const createShipmentAPI = async (shipmentData) => {
  const client = await getApiClient()
  return client.post('/shipment/create', shipmentData)
}

const fetchShipmentExpeditingListAPI = async () => {
  const client = await getApiClient()
  return client.get('/shipment/expediting/list')
}

export {
  fetchShipmentListAPI,
  fetchShipmentStatusListAPI,
  createShipmentAPI,
  readShipmentByTrackingNumberAPI,
  fetchShipmentExpeditingListAPI,
}
