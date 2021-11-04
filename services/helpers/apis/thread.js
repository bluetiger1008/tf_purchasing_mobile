import { getApiClient } from '../apiConfig'

const client = getApiClient()

const createThreadDraftAPI = async (
  isInternal,
  subject,
  replyTo,
  body,
  toEmail,
  authorId
) => {
  const client = await getApiClient()
  return client.post(`/thread/draft/create`, {
    is_internal: isInternal,
    subject,
    'reply-to': replyTo,
    body,
    'to-email': toEmail,
    author_id: authorId,
  })
}

const sendThreadDraftAPI = async (uuid) => {
  const client = await getApiClient()
  return client.put(`thread/draft/send/${uuid}`)
}

const updateThreadDraftAPI = async (uuid, draftBody) => {
  const client = await getApiClient()
  return client.put(`/thread/draft/update/${uuid}`, draftBody)
}

const deleteThreadDraftAPI = async (uuid) => {
  const client = await getApiClient()
  return client.delete(`/thread/draft/delete/${uuid}`)
}

const markReadMessageAPI = (uuid) => {
  return client.post(`/thread/markread/${uuid}`)
}

export {
  createThreadDraftAPI,
  sendThreadDraftAPI,
  updateThreadDraftAPI,
  markReadMessageAPI,
  deleteThreadDraftAPI,
}
