import React, { useState, useEffect } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { Appbar, Card, Title, Text } from 'react-native-paper'
import {
  fetchShipmentListAPI,
  fetchShipmentStatusListAPI,
} from 'services/helpers/apis/shipment'
import Loader from 'components/loader'
import Paginator from 'components/paginator'

import { FilterBox, FilterInfo, ShowControl, TextPair } from 'components'

const ShipmentsList = ({ navigation }) => {
  const [loadingTable, setLoadingTable] = useState(false)
  const [tableViewInfo, setTableViewInfo] = useState({
    totalRows: 0,
    pageIndex: 1,
    rowsCount: 25,
  })
  const [filterValues, setFilterValues] = useState({
    statuses: [],
    searchTerm: '',
  })
  const [statusList, setStatusList] = useState([])
  const [shipments, setShipments] = useState([])

  let filterList = [
    {
      selectedItems: filterValues.statuses,
      arrayData: statusList,
      label: 'Status',
      property: 'status',
      propertyName: 'statuses',
    },
  ]

  const onChangeFilter = (_filterValues) => {
    const { statuses = [], searchTerm = null } = _filterValues
    fetchShipmentList(tableViewInfo, {
      statuses,
      searchTerm,
    })

    setFilterValues({
      statuses,
      searchTerm,
    })
  }

  const fetchShipmentList = async (viewInfo, _filterValues = null) => {
    setLoadingTable(true)
    try {
      const shipmentListResponse = await fetchShipmentListAPI({
        ...viewInfo,
        ..._filterValues,
      })
      const { shipments, total_rows } = shipmentListResponse.data.data

      setShipments([...shipments])

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
        fetchShipmentList(tableViewInfo)

        const statusListRes = await fetchShipmentStatusListAPI()
        setStatusList(statusListRes.data.data)
      } catch (e) {
        context.onApiError(e)
      }
    }

    fetchApis()
  }, [])

  const renderItem = ({ item: row, i }) => {
    return (
      <Card
        key={i}
        style={styles.card}
        onPress={() =>
          navigation.navigate({
            name: 'ShipmentView',
            params: { trackingNumber: row.tracking_number },
          })
        }
      >
        <Card.Content>
          <View style={styles.detailsTop}>
            <View style={{ width: '100%' }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View>
                  <Text
                    style={{ fontSize: 12, color: 'gray', fontWeight: 'bold' }}
                  >
                    Tracking #
                  </Text>
                  <Title
                    style={{
                      textDecorationLine: 'underline',
                      marginTop: 0,
                      fontSize: 18,
                    }}
                  >
                    {row.tracking_number}
                  </Title>
                </View>

                <View style={styles.tag}>
                  <Text
                    numberOfLines={1}
                    style={{ color: '#FFF', fontWeight: 'bold', width: 'auto' }}
                  >
                    {row.status.term}
                  </Text>
                </View>
              </View>

              <View style={styles.carrier}>
                <TextPair
                  style={{ width: '40%' }}
                  text={'Carrier'}
                  value={row.carrier}
                />
                <TextPair
                  style={{ width: '40%' }}
                  text={'Service'}
                  value={row.service_name}
                />
              </View>

              <TextPair
                style={{ width: '100%' }}
                text={'Requisition ID'}
                value={row.lines
                  .map(
                    (line, i) =>
                      `${line.requisition ? line.requisition.order_id : ''}`
                  )
                  .join(', ')}
              />

              <View style={styles.date_wrapper}>
                <TextPair
                  style={{ width: '30%' }}
                  text={'Shipped'}
                  value={row.ship_date.human_date.relative.long}
                />
                <TextPair
                  style={{ width: '30%' }}
                  text={'Delivery'}
                  value={row.expected_delivery_date.human_date.relative.long}
                />
                <TextPair
                  style={{ width: '40%' }}
                  text={'Last Scan Date'}
                  value={row.last_scan_date.human_date.relative.long}
                />
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    )
  }

  const onChangePage = (pageIndex, numberOfRows = tableViewInfo.rowsCount) => {
    fetchShipmentList({ pageIndex, rowsCount: numberOfRows })
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title='Shipments' subtitle='' />
        <FilterBox onUpdateFilter={onChangeFilter} list={filterList} />
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>
      <View style={styles.wrapper}>
        <ShowControl visible={shipments}>
          <Paginator
            onChangePage={onChangePage}
            tableViewInfo={tableViewInfo}
          />
          <FilterInfo list={filterList} searchTerm={filterValues.searchTerm} />
        </ShowControl>

        {!shipments || loadingTable ? (
          <View style={styles.content}>
            <Loader />
          </View>
        ) : (
          <View>
            {shipments && shipments.length > 0 && (
              <FlatList
                data={shipments}
                renderItem={renderItem}
                keyExtractor={(item) => item.tracking_number}
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
  tag: {
    backgroundColor: 'gray',
    padding: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    marginVertical: 2,
    maxWidth: 120,
  },
  date_wrapper: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    borderTopColor: '#dedede',
    borderTopWidth: 0.5,
    paddingTop: 5,
    marginTop: 7,
  },
  carrier: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
  },
})

export default ShipmentsList
