import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import { Field, reduxForm } from 'redux-form'
import { ReduxTextField } from 'components/reduxFormFields'

const ProfileForm = ({ handleSubmit, pristine }) => {
  return (
    <View style={styles.content}>
      <Field
        name='first_name'
        label='First Name'
        component={ReduxTextField}
        fullWidth
      />
      <Field
        name='last_name'
        label='Last Name'
        component={ReduxTextField}
        fullWidth
      />
      <Field
        name='email'
        label='Email'
        component={ReduxTextField}
        fullWidth
        keyboardType='email-address'
      />
      <Field
        name='phone'
        label='Phone'
        component={ReduxTextField}
        fullWidth
        keyboardType='phone-pad'
      />
      <Button
        style={styles.button}
        disabled={pristine}
        mode='contained'
        onPress={handleSubmit}
      >
        Update
      </Button>
    </View>
  )
}

const validate = (values) => {
  const errors = {}

  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
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
  form: 'profileForm',
  enableReinitialize: true,
  validate,
})(ProfileForm)

export default CreateReduxForm
