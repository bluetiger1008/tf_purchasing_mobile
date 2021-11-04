import React, { useState } from 'react'
import { ImageBackground, View } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'

import styles from './styles'
import loginHero from '../../assets/login_hero.jpg'

const AuthWrapper = ({ children }) => {
  return (
    <PaperProvider>
      <ImageBackground source={loginHero} style={styles.image}>
        <View style={styles.container}>{children}</View>
      </ImageBackground>
    </PaperProvider>
  )
}

export default AuthWrapper
