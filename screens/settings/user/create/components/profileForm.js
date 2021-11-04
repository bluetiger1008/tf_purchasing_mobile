import React, { useState, useEffect, useContext } from 'react'
import { View } from 'react-native'
import { Field } from 'redux-form'
import {
  ReduxTextField,
  ReduxSelectField,
  ReduxSingleSelectField,
} from 'components/reduxFormFields'
import { ShowControl } from 'components'
import { GlobalContext } from '../../../../../Main'
import { getApiClient } from 'services/helpers/apiConfig'

import _startCase from 'lodash/startCase'
import _filter from 'lodash/filter'
import _some from 'lodash/some'
import _includes from 'lodash/includes'

const ProfileForm = ({ isUpdateSupplier }) => {
  const context = useContext(GlobalContext)
  const [userTypes, setUserTypes] = useState([])

  // const fetchUserTypes = async () => {
  //   const client = await getApiClient()
  //   try {
  //     const userTypeList = await client.get('userType/list')
  //     setUserTypes(userTypeList.data.data)
  //   } catch (e) {
  //     console.log(e, 'user type error')
  //     context.onApiError(e)
  //   }
  // }

  const fetchUserTypeList = async () => {
    const client = await getApiClient()
    try {
      const userTypeListResponse = await client.get('userType/list')
      const list = userTypeListResponse.data.data
      setUserTypes(list)
    } catch (error) {
      console.log(error)
      context.onApiError(error)
    }
  }

  useEffect(() => {
    if (!isUpdateSupplier) {
      fetchUserTypeList()
    }
  }, [])
  return (
    <View>
      <Field
        name='firstname'
        label='First Name'
        component={ReduxTextField}
        fullWidth
      />
      <Field
        name='lastname'
        label='Last Name'
        component={ReduxTextField}
        fullWidth
      />
      <Field
        name='email'
        label='Email'
        component={ReduxTextField}
        fullWidth
        type='email'
      />
      <Field
        name='phone'
        label='Phone'
        component={ReduxTextField}
        fullWidth
        type='tel'
      />
      <ShowControl visible={!isUpdateSupplier && userTypes.length > 0}>
        <Field
          name='userType'
          component={ReduxSingleSelectField}
          label='User Type'
          id='id'
          text='user_type'
          options={userTypes}
          onChange={() => {}}
        />
      </ShowControl>
    </View>
  )
}

export default ProfileForm
