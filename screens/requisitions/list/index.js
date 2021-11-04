import React, { useState, useEffect, useContext } from 'react'
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native'
import { Appbar, Card, Title, Text } from 'react-native-paper'
import { useTheme } from 'react-native-paper'

import { getApiClient } from 'services/helpers/apiConfig'
import {
  getRequisitionListAPI,
  getRequisitionsSearchAPI,
} from 'services/helpers/apis/requisition'

import RequisitionQuickGlance from '../requisitionQuickGlance'
import StatusLabel from 'components/tables/statusLabel'
import QuantityChart from 'components/tables/quantityChart'
import AssignDropdown from 'components/tables/assignDropdown'
import { ShowControl } from 'components'
import _find from 'lodash/find'
import Loader from 'components/loader'
import Paginator from 'components/paginator'
import { GlobalContext } from '../../../Main'

import { FilterBox, FilterInfo } from 'components'

const Requisitions = ({ navigation }) => {
  const context = useContext(GlobalContext)
  const [filterModal, setFilterModal] = useState(false)
  const [requisitionsList, setRequisitionsList] = useState(null)
  const [quantitiesColors, setQuantitiesColors] = useState(null)
  const [tableViewInfo, setTableViewInfo] = useState({
    totalRows: 0,
    pageIndex: 1,
    rowsCount: 25,
  })
  const [filterValues, setFilterValues] = useState({
    statuses: [],
    users: [],
    searchTerm: '',
  })
  const [statusList, setStatusList] = useState([])
  const [userList, setUserList] = useState([])
  const [loadingTable, setLoadingTable] = useState(false)
  const { colors } = useTheme()

  let filterList = [
    {
      selectedItems: filterValues.statuses,
      arrayData: statusList,
      label: 'Status',
      property: 'status',
      propertyName: 'statuses',
    },
    {
      selectedItems: filterValues.users,
      arrayData: userList,
      label: 'Assignee',
      property: 'name',
      propertyName: 'users',
    },
  ]

  const fetchRequisitionList = async (viewInfo, _filterValues = null) => {
    setLoadingTable(true)
    try {
      const requisitionListResponse = await getRequisitionListAPI({
        ...viewInfo,
        ..._filterValues,
      })
      const { requisition, quantities_colors, total_rows } =
        requisitionListResponse.data.data

      setRequisitionsList([...requisition])
      setQuantitiesColors(quantities_colors)

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
      try {
        const client = await getApiClient()
        fetchRequisitionList(tableViewInfo)

        const userListRes = await client.get('user/assign/requisition')
        const statusListRes = await client.get('requisitions/status/list')
        setUserList(userListRes.data.data)
        setStatusList(statusListRes.data.data)
      } catch (e) {
        context.onApiError(e)
      }
    }

    fetchApis()
  }, [])

  const onPressRequisitionId = (requisition) => {
    navigation.navigate('RequisitionView', {
      requisition,
    })
  }

  const onChangePage = (pageIndex, numberOfRows = tableViewInfo.rowsCount) => {
    fetchRequisitionList({ pageIndex, rowsCount: numberOfRows })
  }
  const onChangeFilter = (_filterValues) => {
    const { statuses = [], users = [], searchTerm = null } = _filterValues
    fetchRequisitionList(tableViewInfo, { statuses, users, searchTerm })

    setFilterValues({
      statuses,
      users,
      searchTerm,
    })
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title='Requisitions' subtitle='' />
        {/* <Appbar.Action icon='filter' onPress={() => setFilterModal(true)} /> */}
        <FilterBox onUpdateFilter={onChangeFilter} list={filterList} />
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>
      <ShowControl visible={requisitionsList}>
        <Paginator onChangePage={onChangePage} tableViewInfo={tableViewInfo} />
        <FilterInfo list={filterList} searchTerm={filterValues.searchTerm} />
      </ShowControl>
      <ScrollView style={styles.wrapper}>
        {!requisitionsList || loadingTable ? (
          <View style={styles.content}>
            <Loader />
          </View>
        ) : (
          <View style={styles.content}>
            {requisitionsList &&
              requisitionsList.length > 0 &&
              requisitionsList.map((requisition, i) => (
                <Card key={i} style={styles.card}>
                  <Card.Content>
                    <View style={styles.detailsTop}>
                      <View style={{ flex: 1 }}>
                        <TouchableOpacity
                          onPress={() => onPressRequisitionId(requisition)}
                        >
                          <Title
                            style={{
                              color: colors.primary,
                              textDecorationLine: 'underline',
                            }}
                          >
                            Requisition ID: {requisition.order_id}
                          </Title>
                        </TouchableOpacity>

                        <Text>
                          Date: {requisition.date.human_date.relative.long}
                        </Text>
                        <Text>
                          Part Numbers:{' '}
                          {requisition.part_numbers.map(
                            (partNumber, i) =>
                              `${partNumber}${
                                i === requisition.part_numbers.length - 1
                                  ? ''
                                  : ', '
                              }`
                          )}
                        </Text>
                        <RequisitionQuickGlance row={requisition} />
                      </View>
                      <View style={{ flex: 1 }}>
                        {statusList && (
                          <StatusLabel
                            statusList={statusList}
                            statusId={requisition.status_id}
                            statusLabel={requisition.status}
                          />
                        )}
                        {userList && (
                          <AssignDropdown
                            userList={userList}
                            selected={requisition}
                            permissions={requisition.permissions}
                            updateFor='requisition'
                          />
                        )}
                      </View>
                    </View>
                    {quantitiesColors && (
                      <QuantityChart
                        requisition={requisition}
                        quantitiesColors={quantitiesColors}
                      />
                    )}
                  </Card.Content>
                </Card>
              ))}
          </View>
        )}
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {},
  content: {
    position: 'relative',
    zIndex: 1,
    padding: 20,
  },
  card: {
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
  },
  detailsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    paddingBottom: 5,
  },
})

export default Requisitions
