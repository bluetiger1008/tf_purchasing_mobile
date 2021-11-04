import React, { useContext, useState, useEffect } from 'react'
import { GlobalContext } from '../../../../Main'
import { View } from 'react-native'
import {
  ReduxTextField,
  ReduxSelectField,
} from '../../../../components/reduxFormFields'
import { Field } from 'redux-form'
import { Title } from 'react-native-paper'
import { Picker } from 'react-native'
import { getApiClient } from '../../../../services/helpers/apiConfig'

const ProfileForm = ({ isUpdateSupplier }) => {
  const context = useContext(GlobalContext)
  const [userTypes, setUserTypes] = useState([])

  const fetchUserTypes = async () => {
    try {
      const client = await getApiClient()
      const userTypeList = await client.get('userType/list')
      setUserTypes(userTypeList.data.data)
    } catch (e) {
      context.onApiError(e)
    }
  }

  useEffect(() => {
    if (!isUpdateSupplier) {
      fetchUserTypes()
    }
  }, [])

  return (
    <View>
      <Title> User Profile</Title>
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
      {!isUpdateSupplier && userTypes.length > 0 && (
        <Field
          name='userType'
          component={ReduxSelectField}
          label='User Type'
          id='field-user-type'
          onChange={() => {}}
        >
          <Picker.Item label='' value='' disabled />
          {userTypes.map((type) => (
            <Picker.Item label={type.user_type} value={type.id} key={type.id} />
          ))}
        </Field>
      )}
    </View>
  )
}

export default ProfileForm
