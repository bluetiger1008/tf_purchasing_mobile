import React, { useEffect, useContext, useState } from 'react'
import { View, StyleSheet, Picker } from 'react-native'
import { Field, reduxForm } from 'redux-form'
import { Text, Button, RadioButton } from 'react-native-paper'
import {
  ReduxTextField,
  ReduxSingleSelectField,
} from 'components/reduxFormFields'
import ReduxRadioButtonField from 'components/reduxFormFields/radioButtonField'
import { GlobalContext } from '../../../../../Main'

import { getRfqDraftAPI } from 'services/helpers/apis/rfq'
import { getManufacturerListAPI } from 'services/helpers/apis/other'

const AddRfqForm = ({
  initialize,
  change,
  handleSubmit,
  requisition,
  partNumbers,
  suppliersList,
}) => {
  const [rfqDrafts, setRfqDrafts] = useState([])
  const [manufacturers, setManufacturers] = useState([])
  const context = useContext(GlobalContext)

  useEffect(() => {
    let initializeBody = {
      quantity: requisition.requisition.quantity.outstanding,
    }

    if (partNumbers.length === 1) {
      initializeBody = {
        ...initializeBody,
        partNumber: partNumbers[0],
      }
    }

    initialize(initializeBody)
  }, [])

  const onSelectSupplier = async (newValue) => {
    try {
      const getRfqDraft = await getRfqDraftAPI(newValue)
      setRfqDrafts(getRfqDraft.data.data.rfq)
      if (getRfqDraft.data.data.rfq.length === 0) {
        change('rfqId', 'new_rfq')
      }
    } catch (e) {
      context.onApiError(e)
    }
  }

  const onSelectPartNumber = async (e, newValue) => {
    try {
      const res = await getManufacturerListAPI(newValue.replace(/\W/g, ''))

      setManufacturers(res.data.data)
    } catch (e) {
      context.onApiError(e)
    }
  }

  return (
    <View style={styles.content}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Add to RFQ</Text>
      <Field
        name='partNumber'
        label='Supplier Name'
        component={ReduxRadioButtonField}
        onChange={onSelectPartNumber}
        fullWidth
      >
        {partNumbers &&
          partNumbers.map((partNumber, i) => (
            <View
              key={i}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <RadioButton.Android value={partNumber} color='#e82559' />
              <Text>{partNumber}</Text>
            </View>
          ))}
      </Field>

      {manufacturers.length > 0 && (
        <Field
          name='manufacturer_id'
          label='Manufacturer'
          component={ReduxSingleSelectField}
          id={'id'}
          text={'name'}
          options={manufacturers}
        />
      )}

      <Field
        name='supplierId'
        label='Supplier'
        component={ReduxSingleSelectField}
        onChange={onSelectSupplier}
        id={'id'}
        text={'name'}
        options={suppliersList}
      />

      <Field
        name='quantity'
        label='Quantity'
        component={ReduxTextField}
        fullWidth
      />

      {rfqDrafts.length === 0 && (
        <Field
          name='rfqId'
          label='Rfq'
          value='new_rfq'
          component={ReduxSingleSelectField}
          id={'id'}
          text={'name'}
          options={[{ id: 'new_rfq', name: 'New RFQ' }]}
        />
      )}

      {rfqDrafts.length > 0 && (
        <Field
          name='rfqId'
          label='Rfq'
          component={ReduxSingleSelectField}
          id={'id'}
          text={'id'}
          options={rfqDrafts}
        />
      )}

      <Button mode='contained' onPress={handleSubmit} style={{ marginTop: 5 }}>
        Next
      </Button>
    </View>
  )
}

const validate = (values) => {
  const errors = {}

  if (!values.partNumber) {
    errors.partNumber = 'Required'
  }

  if (!values.supplierId) {
    errors.supplierId = 'Required'
  }

  if (!values.quantity) {
    errors.quantity = 'Required'
  } else if (!/^\d+$/.test(values.quantity)) {
    errors.quantity = 'Quantity must be integer'
  }

  if (!values.rfqId) {
    errors.rfqId = 'Required'
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
  form: 'addRfqForm',
  validate: validate,
})(AddRfqForm)

export default CreateReduxForm
