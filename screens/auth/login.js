import React, { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'
import { TextInput, Card, Button } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'

import AuthWrapper from './authWrapper'
import authActions from '../../services/redux/auth/actions'
import styles from './styles'
import logo from '../../assets/logo.png'

const { login } = authActions

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isFormError, setIsFormError] = useState(false)
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)

  const onForgotPassword = () => {
    navigation.navigate('Forgot')
  }

  const onLogin = () => {
    if (username !== '' && password !== '') {
      dispatch(
        login({
          userName: username,
          password,
        })
      )
    } else {
      setIsFormError(true)
    }
  }

  return (
    <AuthWrapper>
      <Card>
        <Card.Content style={styles.cardContent}>
          <Image
            source={logo}
            style={{
              resizeMode: 'contain',
              width: 200,
              height: 50,
              marginBottom: 20,
            }}
          />
          <View style={styles.inputView}>
            <TextInput
              label='User Name'
              mode='outlined'
              value={username}
              onChangeText={(text) => setUsername(text)}
              error={isFormError && username === ''}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              mode='outlined'
              label='Password'
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
              error={isFormError && password === ''}
            />
          </View>
          <Button
            mode='contained'
            onPress={onLogin}
            style={styles.submitBtn}
            labelStyle={styles.submitBtnLabel}
            loading={auth.loading}
            disabled={auth.loading}
          >
            Login
          </Button>
          <TouchableOpacity onPress={onForgotPassword}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </AuthWrapper>
  )
}

export default LoginScreen
