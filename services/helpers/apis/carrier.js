import { getApiClient } from '../apiConfig'

const getCarriersList = async () => {
  const client = await getApiClient()
  return client.get('/carriers/list')
}

const getCarriersServicesList = async (carrierId) => {
  const client = await getApiClient()
  return client.get(
    `/carriers/services/list${carrierId ? `?carrier=${carrierId}` : ''}`
  )
}

export { getCarriersList, getCarriersServicesList }
