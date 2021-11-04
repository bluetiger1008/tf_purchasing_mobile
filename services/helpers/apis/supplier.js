import { getApiClient } from '../apiConfig'

const client = getApiClient()

const fetchSuppliersAPI = async () => {
  const client = await getApiClient()
  return client.get('/suppliers/list')
}

const readSupplierAPI = async (uuid) => {
  const client = await getApiClient()
  return client.get(`/supplier/read/${uuid}`)
}

const updateSupplierProfileAPI = async (uuid, profileObj) => {
  const client = await getApiClient()
  return client.put(`/supplier/update/${uuid}`, profileObj)
}

const searchSupplierAPI = (str) => {
  return client.get(`/supplier/search?term=${str}`)
}

const uploadSupplierLogoAPI = async (uuid, file) => {
  const client = await getApiClient()
  const formData = new FormData()
  formData.append('file', file)
  const config = {
    headers: {
      'content-type': 'application/octet-stream',
    },
  }
  return client.post(`/supplier/logo/${uuid}/upload`, formData, config)
}

const createSupplierProfileAPI = async (profileObj) => {
  const client = await getApiClient()
  return client.post('/supplier/create', profileObj)
}

const unlinkUserSupplierAPI = async (uuid) => {
  const client = await getApiClient()
  return client.put(`/supplier/unlink_user/${uuid}`)
}

export {
  fetchSuppliersAPI,
  readSupplierAPI,
  updateSupplierProfileAPI,
  searchSupplierAPI,
  uploadSupplierLogoAPI,
  unlinkUserSupplierAPI,
  createSupplierProfileAPI,
}
