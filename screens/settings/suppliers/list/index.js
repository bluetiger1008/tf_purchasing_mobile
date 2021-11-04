import React, { useState, useEffect, useContext } from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Appbar, Text, FAB } from 'react-native-paper'
import { fetchSuppliersAPI } from 'services/helpers/apis/supplier'
import Loader from 'components/loader'
import Paginator from 'components/paginator'
import SearchBar from 'components/searchBar'
import { GlobalContext } from '../../../../Main'
import { HeaderLinkTree } from 'components'

const SupplierList = ({ navigation }) => {
  const context = useContext(GlobalContext)
  const [supplierList, setSupplierList] = useState(null)
  const [fullSupplierList, setFullSupplierList] = useState(null)
  const [tableViewInfo, setTableViewInfo] = useState({
    totalRows: 5,
    pageIndex: 1,
    rowsCount: 25,
  })

  const fetchSuppliersList = async () => {
    try {
      let res
      res = await fetchSuppliersAPI()
      const list = res.data.data
      const paginatedList = getPaginatedList(
        list,
        tableViewInfo.pageIndex,
        tableViewInfo.rowsCount
      )
      setFullSupplierList(list)
      setSupplierList(paginatedList)
      setTableViewInfo({
        pageIndex: tableViewInfo.pageIndex,
        rowsCount: tableViewInfo.rowsCount,
        totalRows: list.length,
      })
    } catch (e) {
      context.onApiError(e)
    }
  }

  useEffect(() => {
    fetchSuppliersList()
  }, [])

  const getPaginatedList = (arrayList, pageIndex, totalRows) => {
    const start = totalRows * (pageIndex - 1)
    const end = start + totalRows
    if (arrayList.length > 0) {
      return arrayList.slice(start, end)
    }
    return null
  }

  const filterList = (term) => {
    var filteredArray = fullSupplierList.filter((str) => {
      return str.name.toLowerCase().indexOf(term.toLowerCase()) >= 0
    })
    return filteredArray
  }

  const onChangePage = (pageIndex, numberOfRows = tableViewInfo.rowsCount) => {
    const newPaginatedList = getPaginatedList(
      fullSupplierList,
      pageIndex,
      numberOfRows
    )
    setSupplierList(newPaginatedList)
  }

  const renderItem = ({ item: row, i }) => {
    const { name, city, state, uuid } = row
    return (
      <View key={i}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate({
              name: 'SupplierView',
              params: { uuid, name },
            })
          }
          style={styles.itemWrapper}
        >
          <View style={{ flex: 0.5 }}>
            <Text
              style={{
                color: 'blue',
                fontSize: 15,
                textDecorationLine: 'underline',
              }}
            >
              {name}
            </Text>
          </View>
          <View style={{ flex: 0.5 }}>
            <Text>
              {city}, {state}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <HeaderLinkTree links={['Settings', 'Suppliers']} />
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>
      <View style={styles.content}>
        {!supplierList ? (
          <View style={styles.content}>
            <Loader />
          </View>
        ) : (
          <View style={{ width: '100%' }}>
            {supplierList && (
              <Paginator
                onChangePage={onChangePage}
                tableViewInfo={tableViewInfo}
              />
            )}
            <View style={styles.searchWrapper}>
              <SearchBar
                onSearch={(term) => {
                  const filteredList = filterList(term)
                  setSupplierList(filteredList)
                }}
              />
            </View>
            <View style={styles.listHeader}>
              <View style={{ flex: 0.5 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Name</Text>
              </View>
              <View style={{ flex: 0.5 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                  City/State
                </Text>
              </View>
            </View>

            {supplierList && supplierList.length > 0 && (
              <FlatList
                data={supplierList}
                renderItem={renderItem}
                keyExtractor={(item) => item.uuid}
                contentContainerStyle={styles.listContainer}
              />
            )}
          </View>
        )}
      </View>

      <FAB
        style={styles.fab}
        small
        icon='plus'
        onPress={() => navigation.navigate('SupplierCreate')}
      />
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
    paddingTop: 0,
    paddingBottom: 200,
    backgroundColor: '#FFF',
  },
  card: {
    borderRadius: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'blue',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.2,
  },
  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
    paddingVertical: 12,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  searchWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
})

export default SupplierList
