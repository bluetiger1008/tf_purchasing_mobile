import React, { useEffect } from 'react'
import { View, StyleSheet, Picker } from 'react-native'
import { Field, reduxForm } from 'redux-form'
import {
  ReduxTextField,
  ReduxSingleSelectField,
  ReduxCheckBoxField,
} from 'components/reduxFormFields'

const PaymentForm = ({ payment, uuid, initialize }) => {
  const {
    internal_account_number,
    payment_terms_id,
    credit_card_email_address,
    supplier_stores_info,
  } = payment
  useEffect(() => {
    initialize({
      internal_account_number,
      payment_terms_id,
      credit_card_email_address,
      supplier_stores_info,
    })
  }, [])

  const MENU_OPTIONS = [
    { label: 'Ten', value: 'ten' },
    { label: 'Twenty', value: 'twenty' },
    { label: 'Thirty', value: 'thirty' },
  ]
  return (
    <View style={styles.content}>
      <Field
        name='internal_account_number'
        label='Internal Account Number'
        component={ReduxTextField}
        fullWidth
      />
      <Field
        name='payment_terms_id'
        label='Payment Terms'
        component={ReduxSingleSelectField}
        id={'value'}
        text={'label'}
        options={MENU_OPTIONS}
      />

      <Field
        name='payment_terms_date'
        label='Send Credit Card Info by'
        component={ReduxSingleSelectField}
        id={'value'}
        text={'label'}
        options={MENU_OPTIONS}
      />

      <Field
        name='supplier_stores_info'
        label='Supplier will store credit card info'
        component={ReduxCheckBoxField}
        fullWidth
      />
      <Field
        name='credit_card_email_address'
        label='Email'
        placeholder='bob@powell.com'
        component={ReduxTextField}
        fullWidth
      />
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    paddingBottom: 20,
  },
})

const CreateReduxForm = reduxForm({
  form: 'paymentForm',
})(PaymentForm)

export default CreateReduxForm
