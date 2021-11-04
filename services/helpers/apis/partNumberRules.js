import { getApiClient } from '../apiConfig'

const getPartNumberRulesListAPI = async (viewInfo) => {
  const client = await getApiClient()

  const searchTerm = viewInfo.searchTerm || ''
  const partNumberClass = viewInfo.partNumberClass || ''
  const supplierId = viewInfo.supplierId || ''

  const query = '/part_number_rules/list'
  const queryPagination = `/part_number_rules/list?${viewInfo.pageIndex}&rows=${viewInfo.rowsCount}`
  const queryAllFilter = `${queryPagination}&part_number_class=${partNumberClass}&supplier_id=${supplierId}&search_term=${searchTerm}`

  let finalQuery = query

  if (viewInfo.supplierId || viewInfo.partNumberClass || viewInfo.searchTerm) {
    finalQuery = queryAllFilter
  } else if (!viewInfo) {
    finalQuery = query
  } else {
    finalQuery = queryPagination
  }

  return client.get(finalQuery)
}

const getPartNumberRulesClassListAPI = async () => {
  const client = await getApiClient()
  return client.get('/part_number_rules/part_number_class/list')
}

const getPartNumberRulesSequenceListAPI = async () => {
  const client = await getApiClient()
  return client.get('/part_number_rules/sequence/list')
}

const updatePartNumberRulesSequenceUpdateAPI = async (sequence) => {
  const client = await getApiClient()
  return client.put('/part_number_rules/sequence/update', {
    sequence,
  })
}

const deletePartNumberRulesAPI = async (uuids) => {
  const client = await getApiClient()
  return client.delete(`/part_number_rules/delete/${uuids}`)
}

const searchPartNumberRulesAPI = async (
  term,
  supplierIds,
  partNumberClassIds
) => {
  const client = await getApiClient()
  return client.get(
    `/part_number_rules/search?term=${term}&supplier_id=${supplierIds}&part_number_class_id=${partNumberClassIds}`
  )
}

const readPartNumberRulesAPI = async (uuid) => {
  const client = await getApiClient()
  return client.get(`/part_number_rules/read/${uuid}`)
}

const getStringEvaluationTypesAPI = async () => {
  const client = await getApiClient()
  return client.get('/part_number_rules/string_evaluation_types/list')
}

const updatePartNumberRuleAPI = async (uuid, body) => {
  const client = await getApiClient()
  return client.put(`/part_number_rules/update/${uuid}`, body)
}

const partNumberRuleProcessAPI = async (uuid, partNumber) => {
  const client = await getApiClient()
  return client.get(
    `/part_number_rules/process/${uuid}?part_number=${partNumber}`
  )
}

const createPartNumberRuleAPI = async (body) => {
  const client = await getApiClient()
  return client.post('/part_number_rules/create', body)
}

export {
  getPartNumberRulesListAPI,
  getPartNumberRulesClassListAPI,
  getPartNumberRulesSequenceListAPI,
  updatePartNumberRulesSequenceUpdateAPI,
  deletePartNumberRulesAPI,
  searchPartNumberRulesAPI,
  readPartNumberRulesAPI,
  getStringEvaluationTypesAPI,
  updatePartNumberRuleAPI,
  partNumberRuleProcessAPI,
  createPartNumberRuleAPI,
}
