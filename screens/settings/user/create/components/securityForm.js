import React from 'react'
import { View } from 'react-native'
import { Field } from 'redux-form'
import { ReduxTextField, ReduxCheckBoxField } from 'components/reduxFormFields'

const SecurityForm = () => {
  return (
    <View>
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
      />
      <Field
        name='emailUserNewPassword'
        label='Email user new password'
        component={ReduxCheckBoxField}
      />
      <Field
        name='requireMFA'
        label='Require MFA'
        component={ReduxCheckBoxField}
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
