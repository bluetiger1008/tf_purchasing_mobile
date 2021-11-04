import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, View, FlatList, Modal } from 'react-native'
import { Appbar, Card, Text, FAB, Checkbox } from 'react-native-paper'
import {
  getPartNumberRulesListAPI,
  getPartNumberRulesClassListAPI,
  getPartNumberRulesSequenceListAPI,
  deletePartNumberRulesAPI,
} from 'services/helpers/apis/partNumberRules'
import { fetchSuppliersAPI } from 'services/helpers/apis/supplier'
import { GlobalContext } from '../../../../Main'
import { ShowControl } from 'components'
import Paginator from 'components/paginator'
import Loader from 'components/loader'
import _find from 'lodash/find'
import FilterBox from './components/filterBox'
import CreatePartNumberRule from './components/createPartNumberRule'
import { HeaderLinkTree } from 'components'

const SupplierPartNumberRulesList = ({ navigation }) => {
  const context = useContext(GlobalContext)
  const [loadingTable, setLoadingTable] = useState(false)
  const [tableViewInfo, setTableViewInfo] = useState({
    totalRows: 0,
    pageIndex: 1,
    rowsCount: 25,
  })
  const [filterModal, setFilterModal] = useState(false)
  const [createPartNumberRule, setCreatePartNumberRule] = useState(false)
  const [partNumberList, setPartNumberList] = useState([])
  const [sequences, setSequences] = useState(null)
  const [suppliers, setSuppliers] = useState(null)
  const [partNumberClasses, setPartNumberClasses] = useState(null)

  const [filterValues, setFilterValues] = useState({
    supplierId: '',
    partNumberClassId: '',
    searchTerm: '',
  })

  const supplierText = filterValues.supplierId
    ? _find(suppliers, { id: filterValues.supplierId }).name
    : ''
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
      await fetchPartNumberList(tableViewInfo, null, null, null, true)
      const [
        resSuppliers,
        resPartNumberRulesClasses,
        resPartNumberRulesSequences,
      ] = await Promise.all([
        fetchSuppliersAPI(),
        getPartNumberRulesClassListAPI(),
        getPartNumberRulesSequenceListAPI(),
      ])

      const sequences = resPartNumberRulesSequences.data.data
      const pnrClasses = resPartNumberRulesClasses.data.data
      const suppliersList = resSuppliers.data.data

      setSequences(sequences)
      setPartNumberClasses(pnrClasses)
      setSuppliers(suppliersList)
    } catch (e) {
      context.onApiError(e)
      console.log(e, 'error')
    } finally {
      setLoadingTable(false)
    }
  }

  const onCreatePartNumberRule = (uuid, name) => {
    navigation.navigate({
      name: 'SupplierPartNumberRulesEdit',
      params: { uuid: uuid, name },
    })
  }

  const fetchPartNumberList = async (
    viewInfo,
    supplierId = null,
    partNumberClass = null,
    searchTerm = null,
    initial = false
  ) => {
    setLoadingTable(true)

    try {
      let resPNRList

      resPNRList = await getPartNumberRulesListAPI({
        ...viewInfo,
        supplierId,
        partNumberClass,
        searchTerm,
      })

      setPartNumberList([...resPNRList.data.data.part_number_rules])

      setTableViewInfo({
        pageIndex: viewInfo.pageIndex,
        rowsCount: viewInfo.rowsCount,
        totalRows: resPNRList.data.data.total_rows,
      })
    } catch (e) {
      context.onApiError(e)
    } finally {
      if (!initial) setLoadingTable(false)
    }
  }

  const onChangeFilter = (
    supplierId = null,
    partNumberClassId = null,
    searchTerm = null
  ) => {
    fetchPartNumberList(
      tableViewInfo,
      supplierId.toString(),
      partNumberClassId.toString(),
      searchTerm
    )

    setFilterValues({
      supplierId,
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
      fetchPartNumberList(tableViewInfo)
      context.onApiSuccess('All Item/s selected are successfully deleted')
    } catch (e) {
      context.onApiError(e)
    }
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
    const supplierId = _find(suppliers, { id: row.supplier_id })
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
              name: 'SupplierPartNumberRulesEdit',
              params: { uuid: row.uuid, name: row.name },
            })
          }
        }}
      >
        <Card.Content>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{row.name}</Text>
          <View style={{ flexDirection: 'row', paddingTop: 10 }}>
            <View style={{ ...styles.tagWrapper, backgroundColor: '#1f7ed1' }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#FFF' }}>
                {supplierId && supplierId.name}
              </Text>
            </View>
            <View
              style={{
                ...styles.tagWrapper,
                backgroundColor: '#d62963',
                marginLeft: 5,
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
    fetchPartNumberList({ pageIndex, rowsCount: numberOfRows })
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <HeaderLinkTree links={['Settings', 'Supplier Part Number Rules']} />
        <Appbar.Action icon='filter' onPress={() => setFilterModal(true)} />
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>
      <View style={styles.content}>
        <ShowControl visible={!!partNumberList}>
          <Paginator
            onChangePage={onChangePage}
            tableViewInfo={tableViewInfo}
          />
          <ShowControl
            visible={supplierText || partNumberClassText || searchTermText}
          >
            <View style={styles.filters}>
              <Text style={{ fontWeight: 'bold' }}>Filters:</Text>
              <ShowControl visible={supplierText}>
                <Text> Supplier = {supplierText}</Text>
              </ShowControl>
              <ShowControl visible={partNumberClassText}>
                <Text> PNC = {partNumberClassText}</Text>
              </ShowControl>
              <ShowControl visible={searchTermText}>
                <Text> term = {searchTermText}</Text>
              </ShowControl>
            </View>
          </ShowControl>
        </ShowControl>

        <ShowControl visible={!partNumberList || loadingTable}>
          <View style={styles.content}>
            <Loader />
          </View>
        </ShowControl>

        <ShowControl visible={partNumberList.length == 0 && !loadingTable}>
          <View style={styles.emptyContainer}>
            <Text
              style={{ color: 'gray', fontWeight: 'bold', paddingBottom: 20 }}
            >
              No items found
            </Text>
          </View>
        </ShowControl>

        <ShowControl visible={!!partNumberList && !loadingTable}>
          <View>
            <ShowControl visible={partNumberList.length > 0}>
              <View style={styles.avatar}>
                <View style={styles.row}>
                  <View style={styles.supplier_indicator} />
                  <Text
                    style={{
                      fontSize: 14,
                      paddingHorizontal: 10,
                      fontWeight: 'bold',
                    }}
                  >
                    Supplier
                  </Text>
                </View>
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
                data={partNumberList}
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
          onPress={() => setCreatePartNumberRule(true)}
        />
      )}

      <Modal visible={createPartNumberRule} transparent animationType='fade'>
        <CreatePartNumberRule
          onClose={() => setCreatePartNumberRule(false)}
          onCreatePartNumberRule={onCreatePartNumberRule}
        />
      </Modal>

      <Modal visible={filterModal} transparent animationType='fade'>
        <FilterBox
          defaultValues={filterValues}
          suppliers={suppliers}
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

export default SupplierPartNumberRulesList
