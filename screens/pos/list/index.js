import React, { useState, useEffect, useContext, useCallback } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { Appbar, Card, Title, Text } from 'react-native-paper'

import { getApiClient } from 'services/helpers/apiConfig'
import { getPoListAPI } from 'services/helpers/apis/po'

import StatusLabel from 'components/tables/statusLabel'
import AssignDropdown from 'components/tables/assignDropdown'

import Paginator from 'components/paginator'
import Loader from 'components/loader'

import { FilterInfo, FilterBox, ShowControl, TextPair } from 'components'

import { GlobalContext } from '../../../Main'

const Pos = ({ navigation }) => {
  const context = useContext(GlobalContext)
  const [purchaseOrdersList, setPurchaseOrdersList] = useState([])
  const [loadingTable, setLoadingTable] = useState(false)
  const [tableViewInfo, setTableViewInfo] = useState({
    totalRows: 0,
    pageIndex: 1,
    rowsCount: 25,
  })
  const [filterValues, setFilterValues] = useState({
    statuses: [],
    suppliers: [],
    users: [],
    searchTerm: '',
  })
  const [statusList, setStatusList] = useState([])
  const [userList, setUserList] = useState([])
  const [suppliersList, setSuppliersList] = useState([])

  let filterList = [
    {
      selectedItems: filterValues.users,
      arrayData: userList,
      label: 'Assignee',
      property: 'name',
      propertyName: 'users',
    },
    {
      selectedItems: filterValues.suppliers,
      arrayData: suppliersList,
      label: 'Supplier',
      property: 'name',
      propertyName: 'suppliers',
    },
    {
      selectedItems: filterValues.statuses,
      arrayData: statusList,
      label: 'Status',
      property: 'status',
      propertyName: 'statuses',
    },
  ]

  useEffect(() => {
    fetchApis()
  }, [])

  const fetchPoList = async (
    viewInfo,
    _filterValues = null,
    showLoading = true
  ) => {
    if (showLoading) {
      setLoadingTable(true)
    }

    try {
      const poListResponse = await getPoListAPI({
        ...viewInfo,
        ..._filterValues,
      })

      const { purchase_order, total_rows } = poListResponse.data.data

      setPurchaseOrdersList([...purchase_order])

      setTableViewInfo({
        pageIndex: viewInfo.pageIndex,
        rowsCount: viewInfo.rowsCount,
        totalRows: total_rows,
      })
    } catch (e) {
      context.onApiError(e)
    } finally {
      setLoadingTable(false)
    }
  }

  const fetchApis = async () => {
    if (purchaseOrdersList <= 0) {
      setLoadingTable(true)
    }

    try {
      const client = await getApiClient()
      const suppliersListRes = await client.get('suppliers/list')
      const statusListRes = await client.get('po/status/list')
      const userListRes = await client.get('user/assign/po')
      fetchPoList(tableViewInfo, null, false)

      setSuppliersList(suppliersListRes.data.data)
      setStatusList(statusListRes.data.data)
      setUserList(userListRes.data.data)
    } catch (e) {
      context.onApiError(e)
    }
  }

  const onPressPoId = (po) => {
    navigation.navigate('PoView', {
      po,
    })
  }

  const renderItem = ({ item: row, i }) => {
    return (
      <Card key={i} style={styles.card} onPress={() => onPressPoId(row)}>
        <Card.Content>
          <View style={styles.detailsTop}>
            <View style={{ width: '100%' }}>
              <View style={styles.header_row}>
                <View>
                  <Title
                    style={{
                      textDecorationLine: 'underline',
                      fontWeight: 'bold',
                    }}
                  >
                    PO ID: {row.id}
                  </Title>
                  <Text style={{ fontSize: 12, color: 'gray' }}>
                    {row.date_added.human_date.relative.long}
                  </Text>
                </View>

                <ShowControl visible={statusList.length > 0}>
                  <StatusLabel
                    statusList={statusList}
                    statusId={row.status_id}
                    statusLabel={row.status}
                  />
                </ShowControl>
              </View>

              <View
                style={{
                  width: '100%',
                  marginVertical: 10,
                }}
              >
                <ShowControl visible={userList.length > 0}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                    Assigned To
                  </Text>
                  <AssignDropdown
                    userList={userList}
                    selected={row}
                    permissions={row.permissions}
                    updateFor='po'
                    selectorStyle={{
                      backgroundColor: '#e8e8e8',
                      borderRadius: 5,
                    }}
                  />
                </ShowControl>
              </View>

              <View>
                <TextPair
                  style={{ width: '100%' }}
                  text={'Part Numbers'}
                  value={row.part_numbers
                    .map((partNumber, i) => `${partNumber}`)
                    .join(', ')}
                />
                <TextPair
                  style={{ width: '100%' }}
                  text={'Requisition ID'}
                  value={row.requisition_ids
                    .map((requisition_id, i) => `${requisition_id}`)
                    .join(', ')}
                />
                <TextPair
                  style={{ width: '100%' }}
                  text={'Supplier'}
                  value={row.supplier}
                />
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    )
  }

  const onChangePage = (pageIndex, numberOfRows = tableViewInfo.rowsCount) => {
    fetchPoList({ pageIndex, rowsCount: numberOfRows })
  }

  const onChangeFilter = (_filterValues) => {
    const {
      statuses = [],
      users = [],
      suppliers = [],
      searchTerm = null,
    } = _filterValues
    fetchPoList(tableViewInfo, {
      statuses,
      users,
      suppliers,
      searchTerm,
    })

    setFilterValues({
      statuses,
      suppliers,
      users,
      searchTerm,
    })
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title='Purchase Orders' subtitle='' />
        <FilterBox onUpdateFilter={onChangeFilter} list={filterList} />
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>
      <View style={styles.wrapper}>
        <ShowControl visible={purchaseOrdersList}>
          <Paginator
            onChangePage={onChangePage}
            tableViewInfo={tableViewInfo}
          />
          <FilterInfo list={filterList} searchTerm={filterValues.searchTerm} />
        </ShowControl>

        {!purchaseOrdersList || loadingTable ? (
          <View style={styles.content}>
            <Loader />
          </View>
        ) : (
          <View>
            {purchaseOrdersList && purchaseOrdersList.length > 0 && (
              <FlatList
                data={purchaseOrdersList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
              />
            )}
          </View>
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  card: {
    marginBottom: 10,
  },
  listContainer: {
    padding: 20,
  },
  detailsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header_row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
})

export default Pos
