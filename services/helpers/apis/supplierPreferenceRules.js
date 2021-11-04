import { getApiClient } from '../apiConfig'

const client = getApiClient()

const getPreferenceRulesListAPI = async (query) => {
  const client = await getApiClient()
  return client.get(`/supplier_preference_rules/list?${query}`)
}

const getPreferenceRulesSequenceListAPI = async () => {
  const client = await getApiClient()
  return client.get('/supplier_preference_rules/sequence/list')
}

const updatePreferenceRulesSequenceAPI = async (sequence) => {
  const client = await getApiClient()
  return client.put('/supplier_preference_rules/sequence/update', {
    sequence,
  })
}

const getPartNumberClassListAPI = async () => {
  const client = await getApiClient()
  return client.get('/supplier_preference_rules/part_number_class/list')
}

const deleteRulesAPI = async (uuids) => {
  const client = await getApiClient()
  return client.delete(`/supplier_preference_rules/delete/${uuids}`)
}

const searchRulesAPI = async (term, partNumberClassIds) => {
  const client = await getApiClient()
  return client.get(
    `/supplier_preference_rules/search?term=${term}&part_number_class_id=${partNumberClassIds}`
  )
}

const getStringEvaluationTypesAPI = async () => {
  const client = await getApiClient()
  return client.get('/supplier_preference_rules/string_evaluation_types/list')
}

const readRuleAPI = async (uuid) => {
  const client = await getApiClient()
  return client.get(`/supplier_preference_rules/read/${uuid}`)
}

const updateRuleAPI = async (uuid, body) => {
  const client = await getApiClient()
  return client.put(`/supplier_preference_rules/update/${uuid}`, body)
}

const createRuleAPI = async (body) => {
  const client = await getApiClient()
  return client.post('/supplier_preference_rules/create', body)
}

const processRuleAPI = (uuid, partNumber) => {
  return client.get(
    `/supplier_preference_rules/test/${uuid}?part_number=${partNumber}`
  )
}

export {
  getPreferenceRulesListAPI,
  getPreferenceRulesSequenceListAPI,
  updatePreferenceRulesSequenceAPI,
  getPartNumberClassListAPI,
  deleteRulesAPI,
  searchRulesAPI,
  getStringEvaluationTypesAPI,
  readRuleAPI,
  updateRuleAPI,
  createRuleAPI,
  processRuleAPI,
}
