/* eslint-disable camelcase */
import { getApiClient } from '../apiConfig'

const fetchCarriersServicesAPI = async () => {
  const client = await getApiClient()
  return client.get('/carriers/services/list')
}

const fetchShipmentAPI = async (uuid) => {
  const client = await getApiClient()
  return client.get(`po/read/${uuid}/shipment`)
}

const fetchShipmentTrackingAPI = async (shipment, poUUID) => {
  const client = await getApiClient()
  const { carrier, tracking_number } = shipment

  return client.get(`shipment/${carrier}/${tracking_number}/${poUUID}`)
}

const fetchCarriersListAPI = async () => {
  const client = await getApiClient()
  return client.get('/carriers/list')
}

const fetchShipmentListAPI = async (status, startDate) => {
  const client = await getApiClient()
  if (status !== 'none' && startDate !== 'none') {
    return client.get(`/shipment/list?status=${status}&after=${startDate}`)
  }

  if (status !== 'none' && startDate === 'none') {
    return client.get(`/shipment/list?status=${status}`)
  }

  if (status === 'none' && startDate !== 'none') {
    return client.get(`/shipment/list?after=${startDate}`)
  }

  return client.get('/shipment/list')
}

const readShipmentAPI = async (trackingNumber) => {
  const client = await getApiClient()
  return client.get(`/shipment/read/${trackingNumber}`)
}

const getManufacturerListAPI = async (partNumber = null) => {
  const client = await getApiClient()
  if (partNumber) {
    return client.get(`/manufacturer/list/?part_number=${partNumber}`)
  }
  return client.get(`/manufacturer/list`)
}

export {
  fetchCarriersServicesAPI,
  fetchShipmentAPI,
  fetchShipmentTrackingAPI,
  fetchCarriersListAPI,
  fetchShipmentListAPI,
  readShipmentAPI,
  getManufacturerListAPI,
}
