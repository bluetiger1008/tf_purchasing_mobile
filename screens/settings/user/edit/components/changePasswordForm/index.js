import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import { Field, reduxForm } from 'redux-form'
import { ReduxTextField, ReduxCheckBoxField } from 'components/reduxFormFields'

const ChangePasswordForm = ({
  handleSubmit,
  pristine,
  self,
  defaultValues,
  initialize,
}) => {
  useEffect(() => {
    initialize({
      ...defaultValues,
    })
  }, [])
  return (
    <View style={styles.content}>
      {self && (
        <Field
          name='oldPassword'
          label='Old Password'
          component={ReduxTextField}
          type='password'
          fullWidth
        />
      )}

      <Field
        name='newPassword'
        label='New Password'
        component={ReduxTextField}
        type='password'
        fullWidth
      />
      {self && (
        <Field
          name='confirmPassword'
          label='Retype New Password'
          component={ReduxTextField}
          fullWidth
          type='password'
        />
      )}

      {!self && (
        <Field
          name='forceChangePassword'
          label='Force User to Change Password'
          component={ReduxCheckBoxField}
          fullWidth
        />
      )}

      {!self && (
        <Field
          name='emailUserNewPassword'
          label='Email user new password'
          component={ReduxCheckBoxField}
          fullWidth
        />
      )}

      <Button
        style={styles.button}
        disabled={pristine}
        mode='contained'
        onPress={handleSubmit}
      >
        Change
      </Button>
    </View>
  )
}

const validate = (values) => {
  const errors = {}
  const strongRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
  )

  if (values.oldPassword) {
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Confirm password is required'
    } else if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = 'Confirm password does not match'
    }
  }

  if (!values.newPassword) {
    errors.newPassword = 'New password is required'
  } else if (!strongRegex.test(values.newPassword)) {
    errors.newPassword =
      'The password does not meet the minimum password requirements'
  } else if (values.newPassword === values.oldPassword) {
    errors.newPassword = 'New password must be different than old password'
  }

  return errors
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    paddingBottom: 10,
  },
  button: {
    marginTop: 15,
    marginBottom: 5,
  },
})

const CreateReduxForm = reduxForm({
  form: 'changePasswordForm',
  validate,
})(ChangePasswordForm)

export default CreateReduxForm
