import React, { useEffect } from 'react'
import { View, StyleSheet, Picker } from 'react-native'
import { Button } from 'react-native-paper'
import { Field, reduxForm } from 'redux-form'
import { ReduxSingleSelectField } from 'components/reduxFormFields'

const SettingsForm = ({ uuid, initialize, handleSubmit }) => {
  useEffect(() => {
    initialize({
      rfq_contact_method: '',
      default_shipping_method: '',
    })
  }, [])

  const onSubmit = (values) => {}
  const MENU_OPTIONS = [
    { label: 'Email', value: 'Email' },
    { label: 'Phone', value: 'Phone' },
  ]

  return (
    <View style={styles.content}>
      <Field
        name='rfq_contact_method'
        label='RFQ Contact Method'
        component={ReduxSingleSelectField}
        id={'value'}
        text={'label'}
        options={MENU_OPTIONS}
      />

      <Field
        name='default_shipping_method'
        placeholder='Default Shipping Mehod'
        label='Default Shipping Mehod'
        component={ReduxSingleSelectField}
        id={'value'}
        text={'label'}
        options={MENU_OPTIONS}
      />
      <Button
        style={styles.button}
        mode='contained'
        onPress={handleSubmit(onSubmit)}
      >
        Update
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    paddingBottom: 20,
  },
  button: {
    marginVertical: 7,
    marginTop: 12,
  },
})

const CreateReduxForm = reduxForm({
  form: 'settingsForm',
})(SettingsForm)

export default CreateReduxForm
