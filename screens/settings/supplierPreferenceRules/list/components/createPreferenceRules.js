import React, { useState, useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, TextInput, Button } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import _find from 'lodash/find'
import { createRuleAPI } from 'services/helpers/apis/supplierPreferenceRules'
import { GlobalContext } from '../../../../../Main'

const CreatePreferenceRule = ({ onClose, onCreatePreferenceRule }) => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const context = useContext(GlobalContext)
  const onCreate = async () => {
    try {
      setLoading(true)
      const response = await createRuleAPI({
        name,
      })

      let uuid = response.data.data.uuid
      onClose()
      context.onApiSuccess('Preference rule created successfully')
      onCreatePreferenceRule(uuid, name)
    } catch (e) {
      context.onApiError(e)
    } finally {
      setLoading(false)
    }
  }
  return (
    <View style={styles.modalWrapper}>
      <View style={styles.content}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
          Create a new supplier preference rule
        </Text>

        <TextInput
          mode='outlined'
          style={styles.textInput}
          label={'Name'}
          value={name}
          onChangeText={(e) => setName(e)}
        />

        <Button
          disabled={loading}
          loading={loading}
          style={{ ...styles.button, marginTop: 12 }}
          mode='contained'
          onPress={onCreate}
        >
          Create
        </Button>

        <MaterialIcons
          name='close'
          size={20}
          style={styles.closeIcon}
          onPress={onClose}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: '#00000066',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '90%',
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  pickerWrapper: {
    borderColor: '#000',
    borderWidth: 0.5,
    marginTop: 5,
    marginBottom: 10,
  },
  button: {
    marginVertical: 7,
  },
  closeIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  textInput: {
    backgroundColor: '#FFF',
    marginVertical: 0,
    paddingVertical: 0,
    marginBottom: 10,
  },
})

export default CreatePreferenceRule
