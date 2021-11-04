import React from 'react'
import { View } from 'react-native'
import { reduxForm } from 'redux-form'
import ProfileForm from './components/profileForm'
import SecurityForm from './components/securityForm'
import { Button } from 'react-native-paper'

const CreateForm = ({
  onSubmit,
  handleSubmit,
  initialValues,
  isUpdateSupplier,
}) => {
  return (
    <View style={{ padding: 20 }}>
      <ProfileForm isUpdateSupplier={isUpdateSupplier} />
      <SecurityForm />

      <Button
        icon='account-plus'
        mode='contained'
        onPress={handleSubmit(onSubmit)}
        type='submit'
      >
        Create
      </Button>
    </View>
  )
}

const validate = (values, props) => {
  const errors = {}
  const strongRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
  )

  if (!values.email) {
    errors.email = 'Email is required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }

  if (!values.firstname) {
    errors.firstname = 'First name is required'
  }

  if (!values.lastname) {
    errors.lastname = 'Last name is required'
  }

  if (!props.isUpdateSupplier && !values.userType) {
    errors.userType = 'User type is Required'
  }

  if (!values.phone) {
    errors.phone = 'Phone is Required'
  }

  if (!props.isUpdateSupplier && !values.password) {
    errors.password = 'Password is required'
  } else if (!strongRegex.test(values.password)) {
    errors.password =
      'The password does not meet the minimum password requirements'
  }

  return errors
}

const CreateReduxForm = reduxForm({
  form: 'createUserForm',
  validate,
})(CreateForm)

export default CreateReduxForm
