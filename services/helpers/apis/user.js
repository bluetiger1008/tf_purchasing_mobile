import { getApiClient } from '../apiConfig'

const loginAPI = async (authData) => {
  const client = await getApiClient()
  let apiString = `/user/login?username=${
    authData.userName
  }&password=${encodeURIComponent(authData.password)}`

  if (authData.googleAuthenticatorCode) {
    apiString = `${apiString}&mfa_code=${authData.googleAuthenticatorCode}`
  }

  return client.get(apiString)
}

const forgotPasswordAPI = async (userName) => {
  const client = await getApiClient()
  return client.get(`/user/passwordReset?username=${userName}`)
}

const setPasswordAPI = async (data) => {
  const client = await getApiClient()
  return client.put(`/user/passwordSet`, data)
}

const forceLogoutAPI = async (userId) => {
  const client = await getApiClient()
  return client.get(`/user/forceLogout?user_id=${userId}`)
}

const fetchUserListAPI = async () => {
  const client = await getApiClient()
  return client.get('user/list')
}
const createUserAPI = async (userData) => {
  const client = await getApiClient()
  return client.post('/user/create', userData)
}

const fetchUserTypeListAPI = async () => {
  const client = await getApiClient()
  return client.get('userType/list')
}

const updateSupplierProfileAPI = async (uuid, profileObj) => {
  const client = await getApiClient()
  return client.put(`/supplier/update/${uuid}`, profileObj)
}

const fetchUserSupplierListAPI = async (cancelToken) => {
  const client = await getApiClient()
  return client.get('/user/list/supplier', {
    cancelToken,
  })
}

const bulkUserMakeActiveAPI = async (userIds) => {
  const client = await getApiClient()
  return client.put('/user/update/active', {
    user_id: userIds,
  })
}

const bulkUserMakeInactiveAPI = async (userIds) => {
  const client = await getApiClient()
  return client.put('/user/update/inactive', {
    user_id: userIds,
  })
}

const bulkUserForceLogoutAPI = async (userIds) => {
  const client = await getApiClient()
  return client.put('/user/update/forceLogout', {
    user_id: userIds,
  })
}

const bulkUserAddMFAAPI = async (userIds) => {
  const client = await getApiClient()
  return client.put('/user/update/addMFA', {
    user_id: userIds,
  })
}

const userReadAPI = async (userName) => {
  const client = await getApiClient()
  return client.get(`/user/read/${userName}`)
}

const userUpdateAPI = async (userName, userData) => {
  const client = await getApiClient()
  return client.put(`/user/update/${userName}`, userData)
}

const revokeAPI = async (key) => {
  const client = await getApiClient()
  if (key) {
    return client.delete(`/user/deleteToken/?key=${key}`)
  }

  return client.delete('/user/deleteToken/')
}

const getGoogleAuthKeyAPI = async (password) => {
  const client = await getApiClient()
  return client.get(`/user/getGoogleAuthKey?password=${password}`)
}

const deleteGoogleAuthCodeAPI = async (password, userId = null) => {
  const client = await getApiClient()
  if (userId) {
    return client.delete(
      `/user/deleteGoogleAuthCode?password=${password}&userId=${userId}`
    )
  }
  return client.delete(`/user/deleteGoogleAuthCode?password=${password}`)
}

const validateGoogleAuthKeyAPI = async (mfaCode, password) => {
  const client = await getApiClient()
  return client.get(
    `/user/validateGoogleAuthKey?mfa_code=${mfaCode}&password=${password}`
  )
}

const addMFAAPI = async (userId) => {
  const client = await getApiClient()
  return client.put('/user/addMFA', {
    id: userId,
  })
}

const removeMFAAPI = async (userId) => {
  const client = await getApiClient()
  return client.put('/user/removeMFA', {
    id: userId,
  })
}

const deleteUserAPI = async (userId) => {
  const client = await getApiClient()
  return client.delete(`/user/delete/${userId}`)
}

export {
  loginAPI,
  forgotPasswordAPI,
  setPasswordAPI,
  forceLogoutAPI,
  fetchUserListAPI,
  fetchUserSupplierListAPI,
  bulkUserMakeActiveAPI,
  bulkUserMakeInactiveAPI,
  bulkUserForceLogoutAPI,
  bulkUserAddMFAAPI,
  userReadAPI,
  userUpdateAPI,
  revokeAPI,
  getGoogleAuthKeyAPI,
  deleteGoogleAuthCodeAPI,
  validateGoogleAuthKeyAPI,
  addMFAAPI,
  removeMFAAPI,
  deleteUserAPI,
  fetchUserTypeListAPI,
  createUserAPI,
  updateSupplierProfileAPI,
}
