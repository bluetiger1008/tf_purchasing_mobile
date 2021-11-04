import React, { useEffect, useContext, useState } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Field, reduxForm } from 'redux-form'
import { Text, Button } from 'react-native-paper'
import {
  ReduxTextField,
  ReduxSingleSelectField,
} from 'components/reduxFormFields'
import {
  updateSupplierProfileAPI,
  uploadSupplierLogoAPI,
  createSupplierProfileAPI,
} from 'services/helpers/apis/supplier'
import { GlobalContext } from '../../../../../Main'
import STATES from 'utils/states_titlecase'
import { isUrlValid, isZipcodeValid } from 'utils/fieldValidation'

const SupplierProfileForm = ({
  handleSubmit,
  uuid = null,
  onSuccessAdd,
  initialValues,
}) => {
  const context = useContext(GlobalContext)
  const [loading, setLoading] = useState()
  const [imageUrl, setImageUrl] = useState(null)

  useEffect(() => {
    ;(async () => {
      if (Platform.OS !== 'web') {
        try {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync()
          if (status !== 'granted') {
            context.onApiError(
              'Sorry, we need camera roll permissions to make this work!'
            )
          }
        } catch (error) {
          context.onApiError(error)
        }
      }
    })()
  }, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.7,
    })

    if (!result.cancelled) {
      setImageUrl(result.uri)
    }
  }

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      if (uuid) {
        await updateSupplierProfileAPI(uuid, { ...initialValues, ...values })

        if (imageUrl) {
          await uploadSupplierLogoAPI(uuid, imageUrl)
        }
        context.onApiSuccess('Supplier Profile Updated', 3000)
      } else {
        const supplierProfileResponse = await createSupplierProfileAPI({
          ...values,
        })
        const uuid = supplierProfileResponse.data.data.uuid
        context.onApiSuccess('Supplier Profile created successfully', 3000)
        onSuccessAdd(uuid)
      }
    } catch (error) {
      console.log(error, 'get error')
      context.onApiError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.content}>
      <Field
        disabled={loading}
        name='name'
        label='Supplier Name'
        component={ReduxTextField}
        fullWidth
      />
      <Field
        disabled={loading}
        name='street_address_1'
        label='Street Address 1'
        component={ReduxTextField}
        fullWidth
      />
      <Field
        disabled={loading}
        name='street_address_2'
        label='Street Address 2'
        component={ReduxTextField}
        fullWidth
      />
      <Field
        disabled={loading}
        name='city'
        label='City'
        component={ReduxTextField}
        fullWidth
      />
      <Field
        disabled={loading}
        name='web_address'
        label='Web Address'
        component={ReduxTextField}
      />
      <Field
        disabled={loading}
        name='state'
        component={ReduxSingleSelectField}
        label='State'
        id={'abbreviation'}
        text={'name'}
        options={STATES}
      />
      <Field
        disabled={loading}
        name='zip'
        label='Zip Code'
        component={ReduxTextField}
        fullWidth
      />
      <Field
        disabled={loading}
        name='warehouse_zip'
        label='Warehouse Zip Code'
        component={ReduxTextField}
        fullWidth
      />
      <View style={{ paddingBottom: 10 }}>
        {imageUrl ? (
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.uploadLogo}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.imageLogo}
                resizeMode='contain'
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.uploadLogo}>
              <Text>Attach Logo</Text>
            </View>
          </TouchableOpacity>
        )}

        <Text>Requirements: Longest size must be 200px.</Text>
      </View>

      <Button
        loading={loading}
        disabled={loading}
        mode='contained'
        onPress={handleSubmit(onSubmit)}
      >
        Update
      </Button>
    </View>
  )
}

const validate = (values) => {
  const errors = {}

  if (!values.name) {
    errors.name = 'Required'
  }

  if (!values.street_address_1) {
    errors.street_address_1 = 'Required'
  }

  if (!values.city) {
    errors.city = 'Required'
  }

  if (!values.web_address) {
    errors.web_address = 'Required'
  } else if (!isUrlValid(values.web_address)) {
    errors.web_address = 'Web address is not valid'
  }

  if (!values.state) {
    errors.web_address = 'Required'
  }

  if (!values.zip) {
    errors.zip = 'Required'
  } else if (!isZipcodeValid(values.zip)) {
    errors.zip = 'Zipcode is not valid'
  }

  if (!values.warehouse_zip) {
    errors.warehouse_zip = 'Required'
  } else if (!isZipcodeValid(values.warehouse_zip)) {
    errors.warehouse_zip = 'Warehouse Zip Code is not valid'
  }

  return errors
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    paddingBottom: 10,
  },
  uploadLogo: {
    height: 80,
    width: 100,
    borderRadius: 8,
    borderColor: '#808080',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderStyle: 'dashed',
  },
  imageLogo: {
    height: 80,
    width: 100,
    borderRadius: 8,
    borderColor: '#808080',
    marginVertical: 10,
  },
})

const CreateReduxForm = reduxForm({
  form: 'supplierProfileForm',
  validate: validate,
})(SupplierProfileForm)

export default CreateReduxForm
