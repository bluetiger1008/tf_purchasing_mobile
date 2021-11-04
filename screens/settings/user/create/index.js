import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native'
import { Button, Text } from 'react-native-paper'
import _find from 'lodash/find'
import { reduxForm } from 'redux-form'
import { fetchUserTypeListAPI, createUserAPI } from 'services/helpers/apis/user'
import { GlobalContext } from '../../../../Main'
import ProfileForm from './components/profileForm'
import SecurityForm from './components/securityForm'
import { MaterialIcons } from '@expo/vector-icons'

const UserCreate = ({
  isUpdateSupplier = false,
  onUserCreated,
  handleSubmit,
  onClose,
}) => {
  const context = useContext(GlobalContext)
  const [supplierUser, setSupplierUser] = useState()
  const [loading, setLoading] = useState(false)

  const fetchUserTypes = async () => {
    try {
      const userTypeList = await fetchUserTypeListAPI()
      setSupplierUser(_find(userTypeList.data.data, { user_type: 'supplier' }))
    } catch (e) {
      context.onApiError(e)
    }
  }

  useEffect(() => {
    if (isUpdateSupplier) {
      fetchUserTypes()
    }
  }, [])

  const onCreateUser = async (values) => {
    let userData = {
      first_name: values.firstname,
      last_name: values.lastname,
      email: values.email,
      phone: values.phone,
    }

    if (!isUpdateSupplier) {
      userData = {
        ...userData,
        user_type_id: values.userType,
        password: values.password,
        force_password_change: values.forceChangePassword,
        email_password: values.emailUserNewPassword,
        require_mfa: values.requireMFA,
        active: values.activeUser,
      }
    } else {
      userData = {
        ...userData,
        user_type_id: supplierUser.id,
      }
    }
    setLoading(true)
    try {
      const user = await createUserAPI(userData)

      context.onApiSuccess(
        `user ${userData.first_name} ${userData.last_name} was created successfully`
      )
      if (!isUpdateSupplier) {
        onUserCreated()
      } else {
        onUserCreated({
          id: user.data.data.id,
          name: `${userData.first_name} ${userData.last_name}`,
          ...userData,
        })
      }
    } catch (err) {
      context.onApiError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.modal_wrapper}>
      <View style={styles.content}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Add New User</Text>
        <ScrollView>
          <ProfileForm isUpdateSupplier={isUpdateSupplier} />

          {!isUpdateSupplier && <SecurityForm />}
        </ScrollView>

        <View style={{ justifyContent: 'flex-end' }}>
          <Button
            loading={loading}
            disabled={loading}
            mode='contained'
            onPress={handleSubmit(onCreateUser)}
          >
            Create
          </Button>
        </View>

        <MaterialIcons
          style={{ position: 'absolute', top: 10, right: 10 }}
          name='close'
          size={20}
          color='gray'
          onPress={onClose}
        />
      </View>
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

const styles = StyleSheet.create({
  button: {
    marginVertical: 7,
  },
  modal_wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: '#0000004D',
  },
  content: {
    width: '90%',
    height: Dimensions.get('window').height * 0.7,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  user_item: {
    paddingVertical: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    backgroundColor: '#FFF',
  },
})

const securityFormInitValues = {
  forceChangePassword: true,
  emailUserNewPassword: true,
  activeUser: true,
}

const CreateReduxForm = reduxForm({
  form: 'userCreate',
  initialValues: securityFormInitValues,
  validate,
})(UserCreate)

export default CreateReduxForm
