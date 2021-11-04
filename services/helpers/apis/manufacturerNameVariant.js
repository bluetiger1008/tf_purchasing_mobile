import { getApiClient } from '../apiConfig'

const getManufacturerNameVariantListAPI = async (viewInfo) => {
  const client = await getApiClient()

  const query = `/manufacturer_name_variant/list?${query}`
  const queryPagination = `/manufacturer_name_variant/list?&rows=${viewInfo.rowsCount}&page=${viewInfo.pageIndex}&unassociated=${viewInfo.unassociated}`
  const queryService = `${queryPagination}&service=${viewInfo.servicesId}`
  const querySearch = `${queryPagination}&search_term=${viewInfo.searchTerm}`

  let finalQuery = query

  if (viewInfo.servicesId) {
    finalQuery = queryService
  } else if (viewInfo.searchTerm) {
    finalQuery = querySearch
  } else if (!viewInfo) {
    finalQuery = query
  } else {
    finalQuery = queryPagination
  }

  return client.get(finalQuery)
}

const getManufacturerServiceListAPI = async () => {
  const client = await getApiClient()
  return client.get('/manufacturer_name_variant/services/list')
}

const searchManufacturerNameVariantAPI = async (term) => {
  const client = await getApiClient()
  return client.get(`/manufacturer_name_variant/search?term=${term}`)
}

const deleteManufacturerNameVariantAPI = async (uuid) => {
  const client = await getApiClient()
  return client.delete(`/manufacturer_name_variant/delete/${uuid}`)
}

const updateManufacturerAPI = async (uuid, body) => {
  const client = await getApiClient()
  return client.put(`/manufacturer_name_variant/update/${uuid}`, body)
}

export {
  getManufacturerNameVariantListAPI,
  getManufacturerServiceListAPI,
  searchManufacturerNameVariantAPI,
  deleteManufacturerNameVariantAPI,
  updateManufacturerAPI,
}
