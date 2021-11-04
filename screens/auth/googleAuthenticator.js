import React, { useState } from 'react'
import { View, Image } from 'react-native'
import { TextInput, Card, Button } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'

import AuthWrapper from './authWrapper'
import authActions from '../../services/redux/auth/actions'
import styles from './styles'
import logo from '../../assets/logo.png'

const { login } = authActions

const GoogleAuthenticator = ({ navigation }) => {
  const [authCode, setAuthCode] = useState('')
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)

  const onSubmit = () => {
    if (auth.authData) {
      dispatch(login({ ...auth.authData, googleAuthenticatorCode: authCode }))
    } else {
    }
  }

  return (
    <AuthWrapper>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Image
            source={logo}
            style={{ width: 400, height: 80, marginBottom: 50 }}
          />
          <View style={styles.inputView}>
            <TextInput
              label='Google Authenticator Code'
              mode='outlined'
              value={authCode}
              onChangeText={(text) => setAuthCode(text)}
            />
          </View>
          <Button
            mode='contained'
            onPress={onSubmit}
            style={styles.submitBtn}
            labelStyle={styles.submitBtnLabel}
            loading={auth.loading}
            disabled={auth.loading}
          >
            Submit
          </Button>
        </Card.Content>
      </Card>
    </AuthWrapper>
  )
}

export default GoogleAuthenticator
