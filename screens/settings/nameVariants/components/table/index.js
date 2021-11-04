import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, View, FlatList, Modal } from 'react-native'
import { Appbar, Card, Text, FAB } from 'react-native-paper'
import { deletePartNumberRulesAPI } from 'services/helpers/apis/partNumberRules'
import { fetchSuppliersAPI } from 'services/helpers/apis/supplier'
import { getManufacturerListAPI } from 'services/helpers/apis/other'
import { GlobalContext } from '../../../../../Main'
import { updateSupplierVariantAPI } from 'services/helpers/apis/supplierNameVariants'
import { ShowControl } from 'components'
import Paginator from 'components/paginator'
import Loader from 'components/loader'
import _find from 'lodash/find'
import FilterBox from './filterBox'
import EditForm from './editForm'
import SelectionUpdate from './selectionUpdate'
import { HeaderLinkTree } from 'components'

const NameVariantTable = ({
  navigation,
  getListAPI,
  getServicesListAPI,
  deleteAPI,
  updateAPI,
  tableType,
  headerName,
}) => {
  const context = useContext(GlobalContext)
  const [loadingTable, setLoadingTable] = useState(false)
  const [tableViewInfo, setTableViewInfo] = useState({
    totalRows: 0,
    pageIndex: 1,
    rowsCount: 25,
  })
  const [filterModal, setFilterModal] = useState(false)
  const [list, setList] = useState([])
  const [selectionList, setSelectionList] = useState([])
  const [sequences, setSequences] = useState(null)
  const [services, setServices] = useState()
  const [editModal, setEditModal] = useState(false)
  const [selectionModal, setSelectionModal] = useState(false)

  const [filterValues, setFilterValues] = useState({
    serviceId: '',
    searchTerm: '',
    unassociated: false,
  })

  const serviceText = filterValues.serviceId || ''
  const searchTermText = filterValues.searchTerm
  const [onSelection, setOnSelection] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectedRow, setSelectedRow] = useState(null)

  // initial api call
  const fetchApis = async () => {
    setLoadingTable(true)
    try {
      await fetchList(tableViewInfo, null, false, null, true)
      const resServices = await getServicesListAPI()
      const servicesList = resServices.data.data
      setServices(servicesList)
    } catch (e) {
      context.onApiError(e)
    } finally {
      setLoadingTable(false)
    }
  }

  const fetchList = async (
    viewInfo,
    servicesId = null,
    unassociated = false,
    searchTerm = null,
    initial = false
  ) => {
    setLoadingTable(true)

    try {
      let resPNRList
      let resSelectionList
      resPNRList = await getListAPI({
        ...viewInfo,
        unassociated,
        servicesId,
        searchTerm,
      })

      if (tableType == 'supplier') {
        setList([...resPNRList.data.data.supplier_name_variants])
        resSelectionList = await fetchSuppliersAPI()
      } else if (tableType == 'manufacturer') {
        setList([...resPNRList.data.data.manufacturer_name_variants])
        resSelectionList = await getManufacturerListAPI()
      } else {
        setList([])
      }

      setSelectionList(resSelectionList.data.data)

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

  const onChangeFilter = async (
    serviceId = null,
    searchTerm = null,
    unassociated
  ) => {
    await fetchList(
      tableViewInfo,
      serviceId.toString(),
      unassociated,
      searchTerm
    )
    setFilterValues({
      serviceId,
      searchTerm,
      unassociated,
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
      fetchList(tableViewInfo)
      context.onApiSuccess('All Item/s selected are successfully deleted')
    } catch (e) {
      context.onApiError(e)
    }
  }

  const updateItem = async (_value) => {
    setEditModal(false)
    try {
      if (tableType === 'supplier') {
        await updateSupplierVariantAPI(selectedRow.uuid, {
          supplier_id: _value,
        })
        context.onApiSuccess('Supplier updated')
      } else if (tableType == 'manufacturer') {
        await updateSupplierVariantAPI(selectedRow.uuid, {
          manufacturer_id: _value,
        })
        context.onApiSuccess('Manufacturer updated')
      } else {
      }
      await fetchList(tableViewInfo, null, false, null, false)
    } catch (e) {
      context.onApiError(e)
    }
  }

  const onDeleteRow = async () => {
    setEditModal(false)
    try {
      await deleteAPI(selectedRow.uuid)
      context.onApiSuccess(
        `${selectedRow.name_variant}/${selectedRow.service_name} successfully deleted`
      )
      await fetchList(tableViewInfo, null, false, null, false)
    } catch (e) {
      context.onApiError(e)
    }
  }

  const onUpdateSelected = async (selectedValue) => {
    setSelectionModal(false)
    try {
      if (tableType === 'supplier') {
        await updateAPI({ supplier_id: selectedValue, uuid: selectedIds })
      } else {
        await updateAPI({
          manufacturer_id: selectedValue,
          uuid: selectedIds,
        })
      }
      context.onApiSuccess(
        `${
          tableType === 'supplier' ? 'Supplier' : 'Manufacturer'
        } updated for selected name variants`
      )
      fetchList(tableViewInfo)
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
    const serviceId = _find(services, (e) => e == row.service_name)

    const isSelected = selectedIds.includes(row.uuid)
    const associateId =
      tableType === 'supplier' ? row.supplier_id : row.manufacturer_id
    const associateValue = _find(selectionList, { id: associateId })

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
            setSelectedRow(row)
            setEditModal(true)
          }
        }}
      >
        <Card.Content>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
            {row.name_variant}
          </Text>

          <View style={{ flexDirection: 'row', paddingTop: 10 }}>
            <View style={{ ...styles.tagWrapper, backgroundColor: '#fc6f03' }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#FFF' }}>
                {serviceId && serviceId}
              </Text>
            </View>
            <View
              style={{
                ...styles.tagWrapper,
                backgroundColor: '#1f7ed1',
                marginLeft: 5,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#FFF' }}>
                {associateValue ? associateValue.name : 'None'}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    )
  }

  const onChangePage = (pageIndex, numberOfRows = tableViewInfo.rowsCount) => {
    fetchList({ pageIndex, rowsCount: numberOfRows })
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <HeaderLinkTree links={['Settings', headerName]} />
        <Appbar.Action icon='filter' onPress={() => setFilterModal(true)} />
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>
      <View style={styles.content}>
        <ShowControl visible={!!list}>
          <Paginator
            onChangePage={onChangePage}
            tableViewInfo={tableViewInfo}
          />
          <ShowControl visible={serviceText || searchTermText}>
            <View style={styles.filters}>
              <Text style={{ fontWeight: 'bold' }}>Filters:</Text>
              <ShowControl visible={serviceText}>
                <Text> Service = {serviceText}</Text>
              </ShowControl>
              <ShowControl visible={searchTermText}>
                <Text> term = {searchTermText}</Text>
              </ShowControl>
            </View>
          </ShowControl>
        </ShowControl>

        <ShowControl visible={!list || loadingTable}>
          <View style={styles.content}>
            <Loader />
          </View>
        </ShowControl>

        <ShowControl visible={list.length == 0 && !loadingTable}>
          <View style={styles.emptyContainer}>
            <Text
              style={{ color: 'gray', fontWeight: 'bold', paddingBottom: 20 }}
            >
              No items found
            </Text>
          </View>
        </ShowControl>

        <ShowControl visible={!!list && !loadingTable}>
          <View>
            <ShowControl visible={list.length > 0}>
              <View style={styles.avatar}>
                <View style={styles.row}>
                  <View
                    style={{
                      ...styles.supplier_indicator,
                      backgroundColor: '#fc6f03',
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      paddingHorizontal: 10,
                      fontWeight: 'bold',
                    }}
                  >
                    Service
                  </Text>
                </View>

                <View style={styles.row}>
                  <View style={styles.supplier_indicator} />
                  <Text
                    style={{
                      fontSize: 14,
                      paddingHorizontal: 10,
                      fontWeight: 'bold',
                    }}
                  >
                    {tableType == 'supplier' ? 'Supplier' : 'Manufacturer'}
                  </Text>
                </View>
              </View>

              <FlatList
                data={list}
                renderItem={renderItem}
                keyExtractor={(item, i) => item.uuid.toString() + i}
                contentContainerStyle={styles.listContainer}
              />
            </ShowControl>
          </View>
        </ShowControl>
      </View>

      <ShowControl visible={onSelection}>
        <FAB
          style={styles.fab}
          small
          icon='update'
          label={selectedIds.length.toString() + ' items'}
          onPress={() => {
            setSelectionModal(true)
          }}
        />
      </ShowControl>

      <Modal visible={selectionModal} transparent animationType='fade'>
        <SelectionUpdate
          list={selectionList}
          onUpdateSelected={onUpdateSelected}
          onClose={() => setSelectionModal(false)}
          tableType={tableType}
        />
      </Modal>

      <Modal visible={editModal} transparent animationType='fade'>
        <EditForm
          row={selectedRow}
          list={selectionList}
          tableType={tableType}
          onClose={() => setEditModal(false)}
          updateItem={updateItem}
          onDelete={onDeleteRow}
        />
      </Modal>

      <Modal visible={filterModal} transparent animationType='fade'>
        <FilterBox
          defaultValues={filterValues}
          services={services}
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

export default NameVariantTable
