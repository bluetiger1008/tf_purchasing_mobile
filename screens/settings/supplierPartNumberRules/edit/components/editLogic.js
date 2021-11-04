import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, TextInput, Button } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import _find from 'lodash/find'
import { SinglePicker } from 'components'

const EditLogic = ({
  logic,
  logicId,
  workflow,
  onClose,
  onUpdateLogic,
  logicIndex,
}) => {
  const [selectedLogicId, setSelectedLogicId] = useState(logicId)
  const [argumentValues, setArgumentValues] = useState([])
  const [selectedLogic, setSelectedLogic] = useState({ arguments: [] })
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const selectedWorkflow = _find(workflow, { logic_function_id: logicId })
    setSelectedLogic(_find(logic, { id: logicId }))
    setArgumentValues(selectedWorkflow.arguments)
  }, [])

  const onChangeTextField = (index, value) => {
    setHasError(false)
    let updatedArgumentValues = argumentValues
    updatedArgumentValues[index] = value
    setArgumentValues([...updatedArgumentValues])
  }

  const onSelectLogic = (value) => {
    setSelectedLogicId(value)
    const _logic = _find(logic, { id: value })
    setSelectedLogic(_logic)

    if (value !== logicId) {
      let emptyValues = []
      _logic.arguments.map((argument) => {
        emptyValues = [...emptyValues, '']
        return argument
      })
      setArgumentValues(emptyValues)
    } else {
      const selectedWorkflow = _find(workflow, {
        logic_function_id: value,
      })
      setArgumentValues(selectedWorkflow.arguments)
    }
  }

  const onUpdate = () => {
    setHasError(false)
    let isFormValid = true
    argumentValues.map((value) => {
      isFormValid = isFormValid && value !== ''
    })

    if (isFormValid) {
      const workflow = {
        logic_function_id: selectedLogic.id,
        arguments: argumentValues,
      }
      onUpdateLogic(workflow, logicIndex)
    } else {
      setHasError(true)
    }
  }

  return (
    <View style={styles.modalWrapper}>
      <View style={styles.content}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
          Supplier Part Number Rule
        </Text>

        <SinglePicker
          title='Logic'
          style={{ marginBottom: 10 }}
          list={logic}
          id='id'
          label='description'
          selectedValue={selectedLogicId}
          onChangeValue={(value) => onSelectLogic(value.id)}
        />

        {selectedLogic.arguments.map((argument, i) => {
          return (
            <TextInput
              key={i}
              mode='outlined'
              style={styles.textInput}
              label={argument}
              value={argumentValues[i]}
              onChangeText={(e) => onChangeTextField(i, e)}
            />
          )
        })}

        <Button
          style={{ ...styles.button, marginTop: 12 }}
          mode='contained'
          onPress={onUpdate}
        >
          Update
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

export default EditLogic
