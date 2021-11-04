import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, View, FlatList, Modal } from 'react-native'
import { Appbar, Card, Text, FAB } from 'react-native-paper'
import {
  getPreferenceRulesListAPI,
  getPreferenceRulesSequenceListAPI,
  updatePreferenceRulesSequenceAPI,
  getPartNumberClassListAPI,
  deleteRulesAPI,
} from 'services/helpers/apis/supplierPreferenceRules'
import { GlobalContext } from '../../../../Main'
import { ShowControl } from 'components'
import Paginator from 'components/paginator'
import Loader from 'components/loader'
import _find from 'lodash/find'
import FilterBox from './components/filterBox'
import CreatePreferenceRule from './components/createPreferenceRules'
import { HeaderLinkTree } from 'components'

const SupplierPreferenceRulesList = ({ navigation }) => {
  const context = useContext(GlobalContext)
  const [loadingTable, setLoadingTable] = useState(false)
  const [tableViewInfo, setTableViewInfo] = useState({
    totalRows: 0,
    pageIndex: 1,
    rowsCount: 25,
  })
  const [filterModal, setFilterModal] = useState(false)
  const [preferenceRulesList, setPreferenceRulesList] = useState([])
  const [sequences, setSequences] = useState(null)
  const [partNumberClasses, setPartNumberClasses] = useState(null)
  const [createPreferenceRules, setCreatePreferenceRule] = useState(false)

  const [filterValues, setFilterValues] = useState({
    partNumberClassId: '',
    searchTerm: '',
  })

  const partNumberClassText = filterValues.partNumberClassId
    ? _find(partNumberClasses, { id: filterValues.partNumberClassId })
        .description
    : ''
  const searchTermText = filterValues.searchTerm

  const [onSelection, setOnSelection] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])

  // initial api call
  const fetchApis = async () => {
    setLoadingTable(true)
    try {
      await fetchPreferenceRulesList(tableViewInfo, null, null, true)
      const [resPartNumberRulesClasses, resPartNumberRulesSequences] =
        await Promise.all([
          getPartNumberClassListAPI(),
          getPreferenceRulesSequenceListAPI(),
        ])

      const sequences = resPartNumberRulesSequences.data.data
      const pnrClasses = resPartNumberRulesClasses.data.data

      setSequences(sequences)
      setPartNumberClasses(pnrClasses)
    } catch (e) {
      context.onApiError(e)
      console.log(e, 'error')
    } finally {
      setLoadingTable(false)
    }
  }

  const fetchPreferenceRulesList = async (
    viewInfo,
    partNumberClass = null,
    searchTerm = null,
    initial = false
  ) => {
    setLoadingTable(true)

    try {
      let resPRList

      resPRList = await getPreferenceRulesListAPI({
        ...viewInfo,
        partNumberClass,
        searchTerm,
      })

      setPreferenceRulesList([...resPRList.data.data.supplier_preference_rules])

      setTableViewInfo({
        pageIndex: viewInfo.pageIndex,
        rowsCount: viewInfo.rowsCount,
        totalRows: resPRList.data.data.total_rows,
      })
    } catch (e) {
      context.onApiError(e)
    } finally {
      if (!initial) setLoadingTable(false)
    }
  }

  const onChangeFilter = (partNumberClassId = null, searchTerm = null) => {
    fetchPreferenceRulesList(
      tableViewInfo,
      partNumberClassId.toString(),
      searchTerm
    )

    setFilterValues({
      partNumberClassId,
      searchTerm,
    })
  }

  const handleSelect = (name) => {
    const selectedIndex = selectedIds.indexOf(name)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1))
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      )
    }

    setSelectedIds(newSelected)
  }

  const onDeleteSelected = async () => {
    const uuids = selectedIds.toString()

    try {
      await deletePartNumberRulesAPI(uuids)
      setSelectedIds([])
      fetchPreferenceRulesList(tableViewInfo)
      context.onApiSuccess('All Item/s selected are successfully deleted')
    } catch (e) {
      context.onApiError(e)
    }
  }

  const onCreatePreferenceRule = (uuid, name) => {
    navigation.navigate({
      name: 'SupplierPreferenceRulesEdit',
      params: { uuid: uuid, name },
    })
  }

  useEffect(() => {
    fetchApis()
  }, [])

  useEffect(() => {
    if (selectedIds.length > 0 && onSelection == false) {
      setOnSelection(true)
    }

    if (selectedIds.length == 0 && onSelection == true) {
      setOnSelection(false)
    }
  }, [selectedIds])

  const renderItem = ({ item: row, i }) => {
    const _partNumberClasses = _find(partNumberClasses, {
      id: row.part_number_class_id,
    })
    const isSelected = selectedIds.includes(row.uuid)
    return (
      <Card
        style={{
          ...styles.card,
          borderWidth: 2,
          borderColor: isSelected ? '#00d123' : '#FFF',
        }}
        onLongPress={() => handleSelect(row.uuid)}
        onPress={() => {
          if (onSelection) {
            handleSelect(row.uuid)
          } else {
            navigation.navigate({
              name: 'SupplierPreferenceRulesEdit',
              params: { uuid: row.uuid, name: row.name },
            })
          }
        }}
      >
        <Card.Content>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{row.name}</Text>
          <View style={{ flexDirection: 'row', paddingTop: 10 }}>
            <View
              style={{
                ...styles.tagWrapper,
                backgroundColor: '#d62963',
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#FFF' }}>
                {_partNumberClasses && _partNumberClasses.description}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    )
  }

  const onChangePage = (pageIndex, numberOfRows = tableViewInfo.rowsCount) => {
    fetchPreferenceRulesList({ pageIndex, rowsCount: numberOfRows })
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <HeaderLinkTree links={['Settings', 'Supplier Preference Rules']} />
        <Appbar.Action icon='filter' onPress={() => setFilterModal(true)} />
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>
      <View style={styles.content}>
        <ShowControl visible={!!preferenceRulesList}>
          <Paginator
            onChangePage={onChangePage}
            tableViewInfo={tableViewInfo}
          />
          <ShowControl visible={partNumberClassText || searchTermText}>
            <View style={styles.filters}>
              <Text style={{ fontWeight: 'bold' }}>Filters:</Text>
              <ShowControl visible={partNumberClassText}>
                <Text> PNC = {partNumberClassText}</Text>
              </ShowControl>
              <ShowControl visible={searchTermText}>
                <Text> term = {searchTermText}</Text>
              </ShowControl>
            </View>
          </ShowControl>
        </ShowControl>

        <ShowControl visible={!preferenceRulesList || loadingTable}>
          <View style={styles.content}>
            <Loader />
          </View>
        </ShowControl>

        <ShowControl visible={preferenceRulesList.length == 0 && !loadingTable}>
          <View style={styles.emptyContainer}>
            <Text
              style={{ color: 'gray', fontWeight: 'bold', paddingBottom: 20 }}
            >
              No items found
            </Text>
          </View>
        </ShowControl>

        <ShowControl visible={!!preferenceRulesList && !loadingTable}>
          <View>
            <ShowControl
              visible={preferenceRulesList.length > 0 && !!partNumberClasses}
            >
              <View style={styles.avatar}>
                <View style={styles.row}>
                  <View style={styles.pnr_indicator} />
                  <Text
                    style={{
                      fontSize: 14,
                      paddingHorizontal: 10,
                      fontWeight: 'bold',
                    }}
                  >
                    Part Number Class
                  </Text>
                </View>
              </View>

              <FlatList
                data={preferenceRulesList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
              />
            </ShowControl>
          </View>
        </ShowControl>
      </View>

      {onSelection ? (
        <FAB
          style={styles.fab}
          small
          icon='delete'
          label={selectedIds.length.toString() + ' items'}
          onPress={onDeleteSelected}
        />
      ) : (
        <FAB
          style={styles.fab}
          small
          icon='plus'
          onPress={() => setCreatePreferenceRule(true)}
        />
      )}

      <Modal visible={createPreferenceRules} transparent animationType='fade'>
        <CreatePreferenceRule
          onClose={() => setCreatePreferenceRule(false)}
          onCreatePreferenceRule={onCreatePreferenceRule}
        />
      </Modal>

      <Modal visible={filterModal} transparent animationType='fade'>
        <FilterBox
          defaultValues={filterValues}
          partNumberClasses={partNumberClasses}
          onClose={() => setFilterModal(false)}
          onChangeFilter={onChangeFilter}
        />
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  supplier_indicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#1f7ed1',
  },
  pnr_indicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#d62963',
  },
  tagWrapper: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'blue',
  },
  pickerWrapper: {
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    borderColor: '#000',
    borderWidth: 0.5,
    marginTop: 5,
    marginBottom: 10,
  },
  button: {
    marginVertical: 7,
  },
  avatar: {
    width: '100%',
    backgroundColor: '#FFF',
    flexDirection: 'row',
    borderTopColor: 'gray',
    borderTopWidth: 0.3,
    padding: 5,
    elevation: 2,
  },
  emptyContainer: {
    flex: 1,
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    paddingBottom: 5,
  },
})

export default SupplierPreferenceRulesList
