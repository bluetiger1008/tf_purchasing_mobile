import { getApiClient } from '../apiConfig'

const client = getApiClient()

const getSupplierNameVariantListAPI = async (viewInfo) => {
  const client = await getApiClient()

  const query = `/supplier_name_variant/list?${query}`
  const queryPagination = `/supplier_name_variant/list?&rows=${viewInfo.rowsCount}&page=${viewInfo.pageIndex}&unassociated=${viewInfo.unassociated}`
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

const getSupplierNameVariantServicesAPI = async () => {
  const client = await getApiClient()
  return client.get('/supplier_name_variant/services/list')
}

const getSupplierNameVariantSearchAPI = async (term) => {
  const client = await getApiClient()
  return client.get(`/supplier_name_variant/search?term=${term}`)
}

const deleteSupplierNameVariantAPI = async (uuid) => {
  const client = await getApiClient()
  return client.delete(`/supplier_name_variant/delete/${uuid}`)
}

const updateSupplierVariantAPI = async (body) => {
  const client = await getApiClient()

  return client.put(`/supplier_name_variant/update`, body)
}

export {
  getSupplierNameVariantListAPI,
  getSupplierNameVariantServicesAPI,
  getSupplierNameVariantSearchAPI,
  deleteSupplierNameVariantAPI,
  updateSupplierVariantAPI,
}
