import React from 'react'
import { Field } from 'redux-form'
import { View } from 'react-native'
import {
  ReduxTextField,
  ReduxCheckBoxField,
} from '../../../../components/reduxFormFields'
import { Title } from 'react-native-paper'

const SecurityForm = () => {
  return (
    <View>
      <Title>Password and Security</Title>
      <Field
        name='password'
        label='Password'
        component={ReduxTextField}
        fullWidth
        type='password'
      />
      <Field
        name='forceChangePassword'
        label='Force User to Change Password'
        component={ReduxCheckBoxField}
        fullWidth
      />
      <Field
        name='emailUserNewPassword'
        label='Email user new password'
        component={ReduxCheckBoxField}
        fullWidth
      />
      {/* <span className='separator' /> */}
      <Field
        name='requireMFA'
        label='Require MFA'
        component={ReduxCheckBoxField}
        fullWidth
      />
      <Field
        name='activeUser'
        label='Active'
        component={ReduxCheckBoxField}
        fullWidth
      />
    </View>
  )
}

export default SecurityForm
