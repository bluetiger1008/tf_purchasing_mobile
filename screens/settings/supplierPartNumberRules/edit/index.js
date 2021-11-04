import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, View, Modal, ScrollView, Alert } from 'react-native'
import {
  Appbar,
  Card,
  Text,
  FAB,
  TextInput,
  Portal,
  Provider,
} from 'react-native-paper'
import {
  readPartNumberRulesAPI,
  getStringEvaluationTypesAPI,
  getPartNumberRulesClassListAPI,
  deletePartNumberRulesAPI,
  updatePartNumberRuleAPI,
} from 'services/helpers/apis/partNumberRules'
import { fetchSuppliersAPI } from 'services/helpers/apis/supplier'
import { listingLogicFunctionsAPI } from 'services/helpers/apis/sourcingRules'
import { GlobalContext } from '../../../../Main'
import _find from 'lodash/find'
import _remove from 'lodash/remove'
import { MaterialIcons } from '@expo/vector-icons'
import { ShowControl } from 'components'
import Loader from 'components/loader'
import EditLogic from './components/editLogic'
import NewLogic from './components/newLogic'
import TestPartNumberRule from './components/testPartNumberRule'
import { HeaderLinkTree } from 'components'
import { SinglePicker } from 'components'

const Edit = ({ navigation, route }) => {
  const context = useContext(GlobalContext)
  const { uuid, name } = route.params

  const [state, setState] = useState({ open: false })
  const [partNumberInfo, setPartNumberInfo] = useState({
    name: '',
    string_evaluation_type_id: '',
    evaluation_string: '',
    supplier_id: '',
    notes: '',
    uuid: '',
    logic: {
      workflow: [],
    },
  })
  const [currentPartNumberInfo, setCurrentPartNumberInfo] = useState(null)
  const [refList, setRefList] = useState({
    evaluationTypes: [],
    partNumberClasses: [],
    suppliers: [],
    logic: [],
  })

  const [edit, setEdit] = useState(false)
  const [editLogic, setEditLogic] = useState(false)
  const [newLogic, setNewLogic] = useState(false)
  const [testPartNumber, setTestPartNumber] = useState(false)
  const [logicIndex, setLogicIndex] = useState(null)
  const [selectedLogic, setSelectedLogic] = useState({
    logic_function_id: '',
  })
  const [loading, setLoading] = useState(true)

  let evaluationType = _find(refList.evaluationTypes, {
    id: partNumberInfo.string_evaluation_type_id,
  })
  let partNumberClass = _find(refList.partNumberClasses, {
    id: partNumberInfo.part_number_class_id,
  })
  let suppliers = _find(refList.suppliers, { id: partNumberInfo.supplier_id })
  let showRule =
    evaluationType &&
    partNumberClass &&
    suppliers &&
    partNumberInfo.evaluation_string

  const fetchApis = async () => {
    try {
      setLoading(true)

      if (uuid) {
        await fetchPartNumberRuleInfo(uuid)
      }

      const [
        evaluationTypeResponse,
        partNumberClassResponse,
        suppliersResponse,
        logicResponse,
      ] = await Promise.all([
        getStringEvaluationTypesAPI(),
        getPartNumberRulesClassListAPI(),
        fetchSuppliersAPI(),
        listingLogicFunctionsAPI(),
      ])

      setRefList({
        evaluationTypes: evaluationTypeResponse.data.data,
        partNumberClasses: partNumberClassResponse.data.data,
        suppliers: suppliersResponse.data.data,
        logic: logicResponse.data.data,
      })
    } catch (e) {
      context.onApiError(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchPartNumberRuleInfo = async () => {
    try {
      const partNumberRuleResponse = await readPartNumberRulesAPI(uuid)

      setPartNumberInfo(partNumberRuleResponse.data.data)
      setCurrentPartNumberInfo(partNumberRuleResponse.data.data)
    } catch (e) {
      context.onApiError(e)
    }
  }

  const updatePartNumber = async (closeModal = true, newPartNumberInfo) => {
    const pni = newPartNumberInfo ? newPartNumberInfo : partNumberInfo
    const updateObject = {
      logic_function_objects: pni.logic.workflow,
      name: pni.name,
      string: pni.evaluation_string,
      string_evaluation_type_id: pni.string_evaluation_type_id,
      part_number_class_id: pni.part_number_class_id,
      supplier_id: pni.supplier_id,
      notes: pni.notes,
    }

    try {
      setLoading(true)
      await updatePartNumberRuleAPI(partNumberInfo.uuid, updateObject)
      await fetchPartNumberRuleInfo()
    } catch (e) {
      setPartNumberInfo(currentPartNumberInfo)
      context.onApiError(e)
    } finally {
      setLoading(false)
      if (closeModal) {
        setEdit(false)
      }
    }
  }

  const onFieldChange = (optionName, value) => {
    setPartNumberInfo({
      ...partNumberInfo,
      [optionName]: value,
    })
  }

  useEffect(() => {
    fetchApis()
  }, [])

  const onUpdateLogic = (workflow, logicIndex) => {
    const logics = [...partNumberInfo.logic.workflow]
    logics[logicIndex] = { ...workflow }
    const newPartNumberInfo = {
      ...partNumberInfo,
      logic: {
        workflow: logics,
      },
    }

    setEditLogic(false)
    updatePartNumber(false, newPartNumberInfo)
  }

  const onAddLogic = (workflow) => {
    let logics = [...partNumberInfo.logic.workflow]
    logics = [...logics, workflow]
    const newPartNumberInfo = {
      ...partNumberInfo,
      logic: {
        workflow: logics,
      },
    }
    setNewLogic(false)
    updatePartNumber(false, newPartNumberInfo)
  }

  const onDeleteLogic = (logicId, i) => {
    const logics = _remove(partNumberInfo.logic.workflow, (n, index) => {
      return n.logic_function_id !== logicId || index !== i
    })
    const newPartNumberInfo = {
      ...partNumberInfo,
      logic: {
        workflow: logics,
      },
    }
    updatePartNumber(false, newPartNumberInfo)
  }

  const onDelete = async () => {
    try {
      await deletePartNumberRulesAPI(uuid)
      navigation.goBack()
      context.onApiSuccess('Part number rules is successfully deleted')
    } catch (e) {
      context.onApiError(e)
    }
  }

  const onStateChange = ({ open }) => setState({ open })

  const goBackConfirmation = () => {
    Alert.alert('Save Changes?', 'all data you change will be saved', [
      {
        text: 'Dont Save',
        onPress: () => {
          setPartNumberInfo(currentPartNumberInfo)
          setEdit(false)
        },
      },
      {
        text: 'Save',
        onPress: updatePartNumber,
      },
    ])
  }

  const deleteConfirmation = () => {
    Alert.alert('Delete this rule?', 'this rule will be permanently deleted', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: onDelete,
      },
    ])
  }

  const deleteLogicConfirmation = (logicId, i) => {
    Alert.alert(
      'Delete this logic?',
      'this logic will be permanently deleted',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => onDeleteLogic(logicId, i),
        },
      ]
    )
  }

  const { open } = state
  return (
    <>
      <Appbar.Header>
        <ShowControl visible={edit}>
          <Appbar.Action
            icon='check'
            color='#FFF'
            onPress={goBackConfirmation}
          />
        </ShowControl>
        <ShowControl visible={!edit}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
        </ShowControl>

        <HeaderLinkTree links={['Settings', 'SPNR', name]} />
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>

      <ShowControl visible={loading}>
        <View style={{ ...styles.content, flex: 1 }}>
          <Loader />
        </View>
      </ShowControl>

      <ShowControl visible={partNumberInfo.uuid && !loading}>
        <ScrollView contentContainerStyle={styles.content}>
          <TextInput
            mode='outlined'
            disabled={!edit}
            style={{
              backgroundColor: '#FFF',
              marginVertical: 10,
              paddingVertical: 0,
            }}
            label='Name for Rule'
            value={partNumberInfo.name}
            multiline
            onChangeText={(e) => {
              onFieldChange('name', e)
            }}
          />

          <ShowControl visible={!edit}>
            <View style={styles.rule_view}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>RULES:</Text>

              <ShowControl visible={!showRule}>
                <Text
                  style={{
                    fontSize: 14,
                    letterSpacing: 1,
                    color: '#1f2126',
                    textAlign: 'center',
                  }}
                >
                  Rule for this item is not yet completely set. Please click{' '}
                  <Text style={{ fontWeight: 'bold' }}> Edit rule </Text> to set
                  a rule
                </Text>
              </ShowControl>

              <ShowControl visible={showRule}>
                <View style={{ paddingLeft: 10, marginBottom: 7 }}>
                  <Text
                    style={{ fontSize: 14, letterSpacing: 1, color: '#1f2126' }}
                  >
                    For any part number that{' '}
                    <Text style={{ fontWeight: 'bold' }}>
                      {' '}
                      {evaluationType && evaluationType.description}{' '}
                    </Text>
                    <Text style={{ fontWeight: 'bold' }}>
                      {partNumberInfo.evaluation_string}{' '}
                    </Text>
                    and is a{' '}
                    <Text style={{ fontWeight: 'bold' }}>
                      {partNumberClass && partNumberClass.description}
                    </Text>{' '}
                    part that is purchased from{' '}
                    <Text style={{ fontWeight: 'bold' }}>
                      {suppliers && suppliers.name}
                    </Text>
                  </Text>
                </View>

                <Text
                  style={{ fontSize: 14, letterSpacing: 0.8, color: '#1f2126' }}
                >
                  apply the following supplier part number rules:
                </Text>
                {partNumberInfo.logic.workflow.map((flow, i) => {
                  return (
                    <View
                      key={i}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 3,
                      }}
                    >
                      <MaterialIcons
                        name='chevron-right'
                        size={15}
                        color='#000'
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          letterSpacing: 0.8,
                          color: '#1f2126',
                          fontWeight: 'bold',
                        }}
                      >
                        {flow.display_text}
                      </Text>
                    </View>
                  )
                })}
              </ShowControl>
            </View>
          </ShowControl>

          <ShowControl visible={!!edit}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>
              Rules:
            </Text>

            <SinglePicker
              title='For any part number that'
              style={{ marginBottom: 10 }}
              list={refList.evaluationTypes}
              id='id'
              label='description'
              selectedValue={partNumberInfo.string_evaluation_type_id}
              onChangeValue={(value) =>
                onFieldChange('string_evaluation_type_id', value.id)
              }
            />

            <TextInput
              mode='outlined'
              style={styles.textInput}
              label='Add search text here'
              value={partNumberInfo.evaluation_string}
              onChangeText={(e) => onFieldChange('evaluation_string', e)}
            />

            <SinglePicker
              title='and is a'
              style={{ marginBottom: 10 }}
              list={refList.partNumberClasses}
              id='id'
              label='description'
              selectedValue={partNumberInfo.part_number_class_id}
              onChangeValue={(value) =>
                onFieldChange('part_number_class_id', value.id)
              }
            />

            <TextInput
              mode='outlined'
              style={styles.textInput}
              label='Add search text here'
              value={partNumberInfo.evaluation_string}
              onChangeText={(e) => onFieldChange('evaluation_string', e)}
            />

            <SinglePicker
              title='that is purchased from'
              style={{ marginBottom: 10 }}
              list={refList.suppliers}
              id='id'
              label='name'
              selectedValue={partNumberInfo.supplier_id}
              onChangeValue={(value) => onFieldChange('supplier_id', value.id)}
            />

            <Text style={{ marginBottom: 5 }}>
              apply the following supplier part number rules:
            </Text>

            {partNumberInfo.logic.workflow.map((flow, i) => {
              return (
                <Card key={i} style={{ marginVertical: 5 }}>
                  <Card.Content style={styles.logic_item}>
                    <Text>{flow.display_text}</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <MaterialIcons
                        name='edit'
                        size={20}
                        color='gray'
                        style={{ paddingHorizontal: 5 }}
                        onPress={() => {
                          setSelectedLogic(flow)
                          setLogicIndex(i)
                          setEditLogic(true)
                        }}
                      />
                      <MaterialIcons
                        name='delete'
                        size={20}
                        color='gray'
                        onPress={() =>
                          deleteLogicConfirmation(flow.logic_function_id, i)
                        }
                        style={{ paddingHorizontal: 5 }}
                      />
                    </View>
                  </Card.Content>
                </Card>
              )
            })}
            <ShowControl visible={partNumberInfo.logic.workflow == 0}>
              <Text style={{ color: 'gray', textAlign: 'center' }}>
                -None is set-
              </Text>
            </ShowControl>
          </ShowControl>

          <TextInput
            disabled={!edit}
            mode='outlined'
            style={styles.textInput}
            label='Notes'
            multiline
            value={partNumberInfo.notes}
            onChangeText={(e) => {
              onFieldChange('notes', e)
            }}
          />
        </ScrollView>
      </ShowControl>

      <Modal transparent visible={testPartNumber} animationType='fade'>
        <TestPartNumberRule
          uuid={uuid}
          onClose={() => setTestPartNumber(false)}
        />
      </Modal>

      <Modal transparent visible={newLogic} animationType='fade'>
        <NewLogic
          onAddLogic={onAddLogic}
          logic={refList.logic}
          onClose={() => {
            setNewLogic(false)
          }}
        />
      </Modal>

      <Modal transparent visible={editLogic} animationType='fade'>
        <EditLogic
          onUpdateLogic={onUpdateLogic}
          logicIndex={logicIndex}
          workflow={partNumberInfo.logic.workflow}
          logic={refList.logic}
          logicId={selectedLogic.logic_function_id}
          onClose={() => {
            setEditLogic(false)
          }}
        />
      </Modal>

      <ShowControl visible={!edit}>
        <FAB
          style={styles.fab}
          label='EDIT RULE'
          onPress={() => setEdit(true)}
        />
      </ShowControl>

      <ShowControl visible={!!edit}>
        <Provider>
          <Portal>
            <FAB.Group
              open={open}
              fabStyle={{ backgroundColor: 'blue' }}
              icon={open ? 'chevron-down' : 'chevron-up'}
              actions={[
                {
                  icon: 'plus',
                  label: 'Add Logic',
                  onPress: () => setNewLogic(true),
                },
                {
                  icon: 'check',
                  label: 'Test Logic',
                  onPress: () => setTestPartNumber(true),
                },

                {
                  icon: 'delete',
                  label: 'Delete Rule',
                  onPress: deleteConfirmation,
                },
              ]}
              onStateChange={onStateChange}
              onPress={() => {
                if (open) {
                }
              }}
            />
          </Portal>
        </Provider>
      </ShowControl>
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    padding: 20,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  pickerWrapper: {
    borderColor: '#000',
    borderWidth: 0.5,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'blue',
  },
  button: {
    marginVertical: 7,
  },
  rule_view: {
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderRadius: 5,
    padding: 10,
    borderColor: '#bababa',
    backgroundColor: '#FFF',
  },
  textInput: {
    backgroundColor: '#FFF',
    marginVertical: 10,
    paddingVertical: 0,
  },
  logic_item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
})

export default Edit
