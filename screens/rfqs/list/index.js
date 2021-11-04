import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { Appbar, Card, Title, Text } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'

import { getApiClient } from 'services/helpers/apiConfig'
import { getRfqListApi } from 'services/helpers/apis/rfq'

import StatusLabel from 'components/tables/statusLabel'
import AssignDropdown from 'components/tables/assignDropdown'

import Paginator from 'components/paginator'
import Loader from 'components/loader'

import { FilterBox, FilterInfo, ShowControl, TextPair } from 'components'
import { GlobalContext } from '../../../Main'

import adminActions from 'services/redux/admin/actions'
import rfqActions from 'services/redux/rfq/actions'
import storageActions from 'services/redux/storage/actions'

import { useRfqListContext } from '../context'

const { setCorrespondenceThreadUUID, setCorrespondenceMessageUUID } =
  adminActions
const { setRfqTableSettings } = storageActions
const { unsetRfqData, onRfqDeleteConfirmed, onRfqSendConfirmed } = rfqActions

const Rfqs = ({ navigation }) => {
  const rfqListContext = useRfqListContext()
  const { statusList, userList, suppliersList, rpqLoading } = rfqListContext
  const context = useContext(GlobalContext)
  const deletedRfq = useSelector((state) => state.rfq.deleted_rfq)
  const sentRfqId = useSelector((state) => state.rfq.sent_rfq_id)
  const [loadingTable, setLoadingTable] = useState(false)
  const [rfqList, setRfqList] = useState([])
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

  // const [userList, setUserList] = useState([])
  // const [suppliersList, setSuppliersList] = useState([])

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
    if (deletedRfq) {
      fetchRfqList(tableViewInfo)
      dispatch(onRfqDeleteConfirmed())
    }
  }, [deletedRfq])

  useEffect(() => {
    if (sentRfqId) {
      dispatch(onRfqSendConfirmed())
      fetchRfqList(tableViewInfo)
    }
  }, [sentRfqId])

  const fetchRfqList = async (viewInfo, _filterValues = null) => {
    setLoadingTable(true)
    try {
      const rfqListResponse = await getRfqListApi({
        ...viewInfo,
        ..._filterValues,
      })
      const { rfq, total_rows } = rfqListResponse.data.data

      setRfqList([...rfq])

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

  useEffect(() => {
    const fetchApis = async () => {
      setLoadingTable(true)
      try {
        const client = await getApiClient()

        // const getUserList = await client.get('user/assign/rfq')
        // const getStatusList = await client.get('rfq/status/list')
        // const getSuppliersList = await client.get('suppliers/list')
        // setUserList(getUserList.data.data)
        // setSuppliersList(getSuppliersList.data.data)

        fetchRfqList(tableViewInfo)
      } catch (e) {
        context.onApiError(e)
      }
    }

    fetchApis()
  }, [])

  const onChangePage = (pageIndex, numberOfRows = tableViewInfo.rowsCount) => {
    fetchRfqList({ pageIndex, rowsCount: numberOfRows })
  }

  const onChangeFilter = (_filterValues) => {
    const {
      statuses = [],
      users = [],
      suppliers = [],
      searchTerm = null,
    } = _filterValues
    fetchRfqList(tableViewInfo, {
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

  const onPressRfqId = (rfq) => {
    navigation.navigate('RfqView', {
      rfq,
    })
  }

  const renderItem = ({ item: rfq, i }) => {
    return (
      <Card key={i} style={styles.card} onPress={() => onPressRfqId(rfq)}>
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
                    Rfq ID: {rfq.id}
                  </Title>
                  <Text style={{ fontSize: 12, color: 'gray' }}>
                    {rfq.date_added.human_date.relative.long}
                  </Text>
                </View>

                {statusList.length > 0 && (
                  <StatusLabel
                    statusList={statusList}
                    statusId={rfq.status_id}
                    statusLabel={rfq.status}
                  />
                )}
              </View>

              <View
                style={{
                  width: '100%',
                  marginVertical: 10,
                }}
              >
                {userList.length > 0 && (
                  <>
                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                      Assigned To
                    </Text>
                    <AssignDropdown
                      userList={userList}
                      selected={rfq}
                      permissions={rfq.permissions}
                      updateFor='rfq'
                      selectorStyle={{
                        backgroundColor: '#e8e8e8',
                        borderRadius: 5,
                      }}
                    />
                  </>
                )}
              </View>

              <View>
                <TextPair
                  style={{ width: '100%' }}
                  text={'Part Numbers'}
                  value={
                    rfq.part_numbers
                      .map((partNumber, i) => `${partNumber}`)
                      .join(', ') || '-- --'
                  }
                />
                <TextPair
                  style={{ width: '100%' }}
                  text={'Requisition ID'}
                  value={
                    rfq.requisition_ids
                      .map((requisition_id, i) => `${requisition_id}`)
                      .join(', ') || '-- --'
                  }
                />
                <TextPair
                  style={{ width: '100%' }}
                  text={'Supplier'}
                  value={rfq.supplier || '-- --'}
                />
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    )
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title='Rfqs' subtitle='' />
        <FilterBox onUpdateFilter={onChangeFilter} list={filterList} />
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>
      <View style={styles.wrapper}>
        <ShowControl visible={rfqList}>
          <Paginator
            onChangePage={onChangePage}
            tableViewInfo={tableViewInfo}
          />
          <FilterInfo list={filterList} searchTerm={filterValues.searchTerm} />
        </ShowControl>

        {!rfqList || loadingTable || rpqLoading ? (
          <View style={styles.content}>
            <Loader />
          </View>
        ) : (
          <View>
            {rfqList && rfqList.length > 0 && (
              <FlatList
                data={rfqList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 100 }}
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
    margin: 20,
    marginBottom: 5,
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

export default Rfqs
