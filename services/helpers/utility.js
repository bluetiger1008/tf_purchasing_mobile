import AsyncStorage from '@react-native-async-storage/async-storage'

export async function clearToken() {
  try {
    await AsyncStorage.removeItem('accessToken')
    await AsyncStorage.removeItem('loggedIn')
    await AsyncStorage.removeItem('username')
  } catch (e) {}
}

export async function storeToken(storageName, token) {
  try {
    await AsyncStorage.setItem(storageName, token)
  } catch (error) {
    console.log('AsyncStorage error during token store:', error)
  }
}

export async function getToken() {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken')
    const loggedIn = await AsyncStorage.getItem('loggedIn')
    const username = await AsyncStorage.getItem('username')

    return { loggedIn, accessToken, username }
  } catch (err) {
    clearToken()
    return null
  }
}
