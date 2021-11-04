import React, { useState } from 'react'
import { View, Image } from 'react-native'
import { TextInput, Card, Button } from 'react-native-paper'

import AuthWrapper from './authWrapper'
import styles from './styles'
import logo from '../../assets/logo.png'

const ForgotScreen = () => {
  const [username, setUsername] = useState('')

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
            />
          </View>
          <Button
            mode='contained'
            onPress={() => console.log('Pressed')}
            style={styles.submitBtn}
            labelStyle={styles.submitBtnLabel}
          >
            Submit
          </Button>
        </Card.Content>
      </Card>
    </AuthWrapper>
  )
}

export default ForgotScreen
