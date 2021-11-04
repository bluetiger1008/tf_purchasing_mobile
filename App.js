import React, { useEffect, useState, useCallback } from 'react'
import { View } from 'react-native'
import { Provider } from 'react-redux'
import * as SplashScreen from 'expo-splash-screen'

import { store } from './services/redux/store'
import Main from './Main'
import { StyleSheet } from 'react-native'

const DELAY_MS = 3000

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)
  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync()
        await new Promise((resolve) => setTimeout(resolve, DELAY_MS))
      } catch (e) {
        console.warn(e)
      } finally {
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync()
    }
  }, [appIsReady])

  if (!appIsReady) {
    return null
  }

  return (
    <View style={styles.viewWrapper} onLayout={onLayoutRootView}>
      <Provider store={store}>
        <Main />
      </Provider>
    </View>
  )
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    width: '100%',
  },
})
