import React, { useState, useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, TextInput, Button } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import _find from 'lodash/find'
import { partNumberRuleProcessAPI } from 'services/helpers/apis/partNumberRules'
import { GlobalContext } from '../../../../../Main'
import { ShowControl } from 'components'

const TestPartNumberRule = ({ onClose, uuid }) => {
  const context = useContext(GlobalContext)
  const [partNumber, setPartNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [showTestButton, setShowTestButton] = useState(true)
  const [partNumberInfo, setPartNumberInfo] = useState({
    partNumberClass: '',
    partNumber: '',
    supplierName: '',
    supplierPartNumber: '',
  })

  const onChangePartNumber = (value) => {
    setPartNumber(value)
  }

  const onTest = async () => {
    try {
      setLoading(true)
      const res = await partNumberRuleProcessAPI(uuid, partNumber)
      const partNumberRule = res.data.data

      setPartNumberInfo({
        partNumberClass: partNumberRule.part_number_class,
        partNumber: partNumberRule.part_number,
        supplierName: partNumberRule.supplier_name,
        supplierPartNumber: partNumberRule.supplier_part_number,
      })
      setShowTestButton(false)
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
          Test Supplier Part Number Rule
        </Text>

        <TextInput
          mode='outlined'
          style={styles.textInput}
          label={'Part Number Rule'}
          value={partNumber}
          onChangeText={(e) => onChangePartNumber(e)}
        />
        <ShowControl visible={!showTestButton}>
          <View style={styles.rule_view}>
            <Text style={{ fontSize: 14, letterSpacing: 1, color: '#1f2126' }}>
              When a{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {partNumberInfo.partNumberClass}{' '}
              </Text>
              part with the part number{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {partNumberInfo.partNumber}{' '}
              </Text>
              is purchased from{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {partNumberInfo.supplierName}
                {', '}
              </Text>
              <Text style={{ fontWeight: 'bold' }}>
                {partNumberInfo.supplierPartNumber}{' '}
              </Text>
              will be used.
            </Text>
          </View>
        </ShowControl>

        <ShowControl visible={showTestButton}>
          <Button
            style={{ ...styles.button, marginTop: 12 }}
            mode='contained'
            onPress={onTest}
            loading={loading}
            disabled={loading}
          >
            Test
          </Button>
        </ShowControl>

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
  rule_view: {
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderRadius: 5,
    padding: 10,
    borderColor: '#bababa',
    backgroundColor: '#FFF',
  },
})

export default TestPartNumberRule
