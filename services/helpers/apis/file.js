import { getApiClient } from '../apiConfig'

const getFileUrl = async (uuid) => {
  const client = await getApiClient()
  return client.get(`file/read/${uuid}/geturl`)
}

export { getFileUrl }
