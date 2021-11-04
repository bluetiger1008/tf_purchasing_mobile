import React, { useState, useEffect, useContext } from 'react'
import { GlobalContext } from '../../../Main'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Appbar } from 'react-native-paper'
import CreateForm from './createForm'

import _find from 'lodash/find'
import { getApiClient } from '../../../services/helpers/apiConfig'
import { SafeAreaView } from 'react-native-safe-area-context'
import { showMessage } from 'react-native-flash-message'

const CreateUser = ({ navigation, route }) => {
  const context = useContext(GlobalContext)
  const [supplierUser, setSupplierUser] = useState()

  const fetchUserTypes = async () => {
    try {
      const client = await getApiClient()
      const userTypeList = await client.get('userType/list')
      setSupplierUser(_find(userTypeList.data.data, { user_type: 'supplier' }))
    } catch (e) {
      context.onApiError(e)
    }
  }

  useEffect(() => {
    if (route?.params?.isUpdateSupplier) {
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

    if (!route?.params?.isUpdateSupplier) {
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

    try {
      const client = await getApiClient()
      const user = await client.post('/user/create', userData)

      showMessage({
        message: `user ${userData.first_name} was created successfully`,
        type: 'success',
        duration: 3000,
        icon: 'success',
      })
      //   toast.success(`user ${userData.username} was created successfully`)
      //   if (!isUpdateSupplier) {
      //     history.push('/admin/user/list')
      //   } else {
      //     onUserCreated({
      //       id: user.data.data.id,
      //       name: `${userData.first_name} ${userData.last_name}`,
      //       ...userData,
      //     })
      //   }
    } catch (err) {
      console.error(err.message)

      context.onApiError(err)
    }
  }

  const securityFormInitValues = {
    forceChangePassword: true,
    emailUserNewPassword: true,
    activeUser: true,
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title='Settings' subtitle='' />
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }}
      >
        <CreateForm
          onSubmit={onCreateUser}
          // initialValues={securityFormInitValues}
          isUpdateSupplier={route?.params?.isUpdateSupplier}
        />
      </ScrollView>
    </>
  )
}

export default CreateUser
