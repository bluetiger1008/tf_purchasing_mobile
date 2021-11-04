import React, { useState, useContext, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Modal,
  Picker,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native'
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
  getStringEvaluationTypesAPI,
  getPartNumberClassListAPI,
  readRuleAPI,
  updateRuleAPI,
  deleteRulesAPI,
} from 'services/helpers/apis/supplierPreferenceRules'
import { fetchSuppliersAPI } from 'services/helpers/apis/supplier'
import { getManufacturerListAPI } from 'services/helpers/apis/other'
import { GlobalContext } from '../../../../Main'
import _find from 'lodash/find'
import _remove from 'lodash/remove'
import { MaterialIcons } from '@expo/vector-icons'
import { ShowControl } from 'components'
import Loader from 'components/loader'
import EditLogic from './components/editLogic'
import { HeaderLinkTree } from 'components'
import { SinglePicker } from 'components'

const Edit = ({ navigation, route }) => {
  const context = useContext(GlobalContext)
  const { uuid, name } = route.params

  const [state, setState] = useState({ open: false })
  const [preferenceRulesInfo, setPreferenceRulesInfo] = useState({
    name: '',
    string_evaluation_type_id: '',
    evaluation_string: '',
    supplier_id: '',
    notes: '',
    uuid: '',
    logic_object: [],
  })
  const [currentPreferenceRulesInfo, setCurrentPreferenceRulesInfo] =
    useState(null)
  const [refList, setRefList] = useState({
    evaluationTypes: [],
    partNumberClasses: [],
    suppliers: [],
    manufacturer: [],
  })

  const [edit, setEdit] = useState(false)
  const [editLogic, setEditLogic] = useState(false)
  const [newLogic, setNewLogic] = useState(false)
  const [logicIndex, setLogicIndex] = useState(null)
  const [selectedLogic, setSelectedLogic] = useState(null)
  const [loading, setLoading] = useState(true)

  let evaluationType = _find(refList.evaluationTypes, {
    id: preferenceRulesInfo.string_evaluation_type_id,
  })
  let partNumberClass = _find(refList.partNumberClasses, {
    id: preferenceRulesInfo.part_number_class_id,
  })

  let showRule =
    evaluationType && partNumberClass && preferenceRulesInfo.evaluation_string

  const fetchApis = async () => {
    try {
      setLoading(true)

      if (uuid) {
        await fetchPreferenceRuleInfo(uuid)
      }

      const [
        evaluationTypeResponse,
        partNumberClassResponse,
        suppliersResponse,
        manufacturerResponse,
      ] = await Promise.all([
        getStringEvaluationTypesAPI(),
        getPartNumberClassListAPI(),
        fetchSuppliersAPI(),
        getManufacturerListAPI(),
      ])

      setRefList({
        evaluationTypes: evaluationTypeResponse.data.data,
        partNumberClasses: partNumberClassResponse.data.data,
        suppliers: suppliersResponse.data.data,
        manufacturer: manufacturerResponse.data.data,
      })
    } catch (e) {
      context.onApiError(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchPreferenceRuleInfo = async () => {
    try {
      const preferenceRuleResponse = await readRuleAPI(uuid)

      setPreferenceRulesInfo(preferenceRuleResponse.data.data)
      setCurrentPreferenceRulesInfo(preferenceRuleResponse.data.data)
    } catch (e) {
      context.onApiError(e)
    }
  }

  const updatePreferenceRules = async (
    closeModal = true,
    newPreferenceRulesInfo
  ) => {
    const pni = newPreferenceRulesInfo
      ? newPreferenceRulesInfo
      : preferenceRulesInfo
    const updateObject = {
      logic_objects: pni.logic_object,
      name: pni.name,
      string: pni.evaluation_string,
      string_evaluation_type_id: pni.string_evaluation_type_id,
      part_number_class_id: pni.part_number_class_id,
      notes: pni.notes,
    }

    try {
      setLoading(true)
      await updateRuleAPI(preferenceRulesInfo.uuid, updateObject)
      await fetchPreferenceRuleInfo()
    } catch (e) {
      setPreferenceRulesInfo(currentPreferenceRulesInfo)
      context.onApiError(e)
    } finally {
      setLoading(false)
      if (closeModal) {
        setEdit(false)
      }
    }
  }

  const onFieldChange = (optionName, value) => {
    setPreferenceRulesInfo({
      ...preferenceRulesInfo,
      [optionName]: value,
    })
  }

  useEffect(() => {
    fetchApis()
  }, [])

  const onUpdateLogic = (logicObj) => {
    let logics = preferenceRulesInfo.logic_object
      ? [...preferenceRulesInfo.logic_object]
      : []
    if (selectedLogic !== null && logicIndex !== null) {
      logics[logicIndex] = { ...logicObj }
    } else {
      logics = [...logics, logicObj]
    }

    const newPreferenceRulesInfo = {
      ...preferenceRulesInfo,
      logic_object: { ...logics },
    }

    setSelectedLogic(null)
    setEditLogic(false)
    updatePreferenceRules(false, newPreferenceRulesInfo)
  }

  const onAddLogic = (logicObj) => {
    let logics = preferenceRulesInfo.logic_object
      ? [...preferenceRulesInfo.logic_object]
      : []
    if (selectedLogic !== null && logicIndex !== null) {
      logics[logicIndex] = { ...logicObj }
    } else {
      logics = [...logics, logicObj]
    }
    const newPreferenceRulesInfo = {
      ...preferenceRulesInfo,
      logic_object: logics,
    }
    setNewLogic(false)
    updatePreferenceRules(false, newPreferenceRulesInfo)
  }

  const onDeleteLogic = (logicIndex) => {
    const logics = [...preferenceRulesInfo.logic_object]
    logics.splice(logicIndex, 1)
    const newPreferenceRulesInfo = {
      ...preferenceRulesInfo,
      logic_object: logics,
    }
    updatePreferenceRules(false, newPreferenceRulesInfo)
  }

  const onDelete = async () => {
    try {
      await deleteRulesAPI(uuid)
      navigation.goBack()
      context.onApiSuccess('Preference rules is successfully deleted')
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
          setPreferenceRulesInfo(currentPreferenceRulesInfo)
          setEdit(false)
        },
      },
      {
        text: 'Save',
        onPress: updatePreferenceRules,
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

        <HeaderLinkTree links={['Settings', 'SPR', name]} />
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

      <ShowControl visible={preferenceRulesInfo.uuid && !loading}>
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
            value={preferenceRulesInfo.name}
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
                      {preferenceRulesInfo.evaluation_string}{' '}
                    </Text>
                    and is a{' '}
                    <Text style={{ fontWeight: 'bold' }}>
                      {partNumberClass && partNumberClass.description}
                    </Text>{' '}
                    part
                  </Text>
                </View>

                <Text
                  style={{ fontSize: 14, letterSpacing: 0.8, color: '#1f2126' }}
                >
                  apply the following supplier part number rules:
                </Text>
                {preferenceRulesInfo.logic_object.map((flow, i) => {
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
              selectedValue={preferenceRulesInfo.string_evaluation_type_id}
              onChangeValue={(value) =>
                onFieldChange('string_evaluation_type_id', value.id)
              }
            />

            <TextInput
              mode='outlined'
              style={styles.textInput}
              label='Add search text here'
              value={preferenceRulesInfo.evaluation_string}
              onChangeText={(e) => onFieldChange('evaluation_string', e)}
            />

            <SinglePicker
              title='and is a'
              style={{ marginBottom: 10 }}
              list={refList.partNumberClasses}
              id='id'
              label='description'
              selectedValue={preferenceRulesInfo.part_number_class_id}
              onChangeValue={(value) =>
                onFieldChange('part_number_class_id', value.id)
              }
            />

            <Text style={{ marginBottom: 5 }}>
              apply the following supplier part number rules:
            </Text>

            {preferenceRulesInfo.logic_object.map((flow, i) => {
              return (
                <Card
                  key={flow.logic_function_id + i}
                  style={{ marginVertical: 5 }}
                >
                  <Card.Content style={styles.logic_item}>
                    <Text style={{ flexShrink: 1 }}>{flow.display_text}</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: 50,
                      }}
                    >
                      <TouchableOpacity
                        style={{ paddingHorizontal: 5 }}
                        onPress={() => {
                          setSelectedLogic(flow)
                          setLogicIndex(i)
                          setEditLogic(true)
                        }}
                      >
                        <MaterialIcons name='edit' size={20} color='gray' />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          deleteLogicConfirmation(flow.logic_function_id, i)
                        }
                        style={{ paddingHorizontal: 5 }}
                      >
                        <MaterialIcons name='delete' size={20} color='gray' />
                      </TouchableOpacity>
                    </View>
                  </Card.Content>
                </Card>
              )
            })}
            <ShowControl visible={preferenceRulesInfo.logic_object == 0}>
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
            value={preferenceRulesInfo.notes}
            onChangeText={(e) => {
              onFieldChange('notes', e)
            }}
          />
        </ScrollView>
      </ShowControl>

      <Modal transparent visible={editLogic} animationType='fade'>
        <EditLogic
          isAdding={newLogic}
          onUpdateLogic={onUpdateLogic}
          suppliers={refList.suppliers}
          manufacturers={refList.manufacturer}
          logic={selectedLogic}
          onClose={() => {
            setSelectedLogic(null)
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
                  onPress: () => {
                    setNewLogic(true)
                    setEditLogic(true)
                  },
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
