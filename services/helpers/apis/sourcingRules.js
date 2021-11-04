import { getApiClient } from '../apiConfig'

const client = getApiClient()

const listingLogicFunctionsAPI = async () => {
  const client = await getApiClient()
  return client.get('/sourcing_rules/logic_functions/list')
}

export { listingLogicFunctionsAPI }
