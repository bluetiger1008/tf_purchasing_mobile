import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, View, FlatList, Modal } from 'react-native'
import { Appbar, Card, Text, FAB, Button } from 'react-native-paper'
import { GlobalContext } from '../../../../Main'

import { useDispatch, connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import adminActions from 'services/redux/admin/actions'
import FilterBox from './components/filterBox'

import { MaterialIcons } from '@expo/vector-icons'

import Paginator from 'components/paginator'

import { getApiClient } from 'services/helpers/apiConfig'
import _startCase from 'lodash/startCase'
import _filter from 'lodash/filter'
import _some from 'lodash/some'
import _includes from 'lodash/includes'

import { SinglePicker } from 'components'
import colors from 'common/colors'

import UserCreate from '../create'
import { HeaderLinkTree } from 'components'

const { fetchUserList, userBulkAction } = adminActions

const bulkOptions = [
  {
    value: '',
    label: '-- --',
  },
  {
    value: 'makeActive',
    label: 'Make Active',
  },
  {
    value: 'makeInactive',
    label: 'Make Inactive',
  },
  {
    value: 'forceLogout',
    label: 'Force Logout',
  },
  {
    value: 'requireMFA',
    label: 'Require MFA',
  },
]

const UsersList = ({ navigation, users, userBulkAction }) => {
  const context = useContext(GlobalContext)
  const dispatch = useDispatch()
  const [filterModal, setFilterModal] = useState(false)
  const [allUserList, setAllUserList] = useState([])
  const [userListForPagination, setUserListForPagination] = useState([])
  const [userList, setUserList] = useState([])
  const [filterValues, setFilterValues] = useState({
    userType: 'all',
    active: null,
    searchTerm: '',
  })
  const [tableViewInfo, setTableViewInfo] = useState({
    totalRows: 0,
    pageIndex: 1,
    rowsCount: 10,
  })
  const [userTypeList, setUserTypeList] = useState([])
  const [onSelection, setOnSelection] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [bulkAction, setBulkAction] = useState('')

  const [addNewUserModal, setAddNewUserModal] = useState(false)

  const fetchUserTypeList = async () => {
    const client = await getApiClient()
    try {
      const userTypeListResponse = await client.get('userType/list')
      const list = userTypeListResponse.data.data
      const newUserTypeList = list.map((type, index) => {
        return {
          label: _startCase(type.user_type),
          value: type.user_type,
        }
      })

      newUserTypeList.unshift({ label: 'All', value: 'all' })
      setUserTypeList(newUserTypeList)
    } catch (error) {
      console.log(error)
      context.onApiError(error)
    }
  }

  useEffect(() => {
    fetchUserTypeList()
    dispatch(fetchUserList())
  }, [])

  const onChangeFilter = (newFilterValues) => {
    const { userType, active, searchTerm } = newFilterValues
    let filteredList = [...allUserList]
    if (userType !== 'all') {
      filteredList = _filter(filteredList, { user_type: userType })
    }

    if (active !== 'all') {
      filteredList = _filter(filteredList, { active: active })
    }

    if (searchTerm) {
      filteredList = _filter(filteredList, (v) => {
        return (
          _includes(v.name.toLowerCase(), searchTerm.toLowerCase()) ||
          _includes(v.username.toLowerCase(), searchTerm.toLowerCase())
        )
      })
    }

    setTableViewInfo({ ...tableViewInfo, totalRows: filteredList.length })
    filteredList = filteredList.slice(
      (tableViewInfo.pageIndex - 1) * tableViewInfo.rowsCount,
      tableViewInfo.rowsCount
    )

    setFilterValues(newFilterValues)
    setUserList(filteredList)
    setUserListForPagination(filteredList)
  }

  const onPaginate = (pageNumber) => {
    setTableViewInfo({ ...tableViewInfo, pageIndex: pageNumber })

    setUserList(
      userListForPagination.slice(
        (pageNumber - 1) * tableViewInfo.rowsCount,
        tableViewInfo.rowsCount * pageNumber
      )
    )
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

  const onChangeBulkAction = (action) => {
    setBulkAction(action)
  }

  const applyBulkAction = () => {
    userBulkAction(bulkAction, selectedIds)
    setBulkAction('')
    setSelectedIds([])
  }

  const onUserCreated = () => {
    setAddNewUserModal(false)
    dispatch(fetchUserList())
  }

  useEffect(() => {
    if (users) {
      setUserList(users.slice(0, 10))
      setAllUserList(users)
      setUserListForPagination(users)
      setTableViewInfo({ ...tableViewInfo, totalRows: users.length })
    }
  }, [users])

  useEffect(() => {
    if (selectedIds.length > 0 && onSelection == false) {
      setOnSelection(true)
    }

    if (selectedIds.length == 0 && onSelection == true) {
      setOnSelection(false)
    }
  }, [selectedIds])

  const renderItem = ({ item: row, i }) => {
    const { username, name, user_type, active, last_login } = row
    const isSelected = selectedIds.includes(row.id)
    return (
      <Card
        style={{
          ...styles.card,
          borderWidth: 2,
          borderColor: isSelected ? '#00d123' : '#FFF',
        }}
        onLongPress={() => handleSelect(row.id)}
        onPress={() => {
          if (onSelection) {
            handleSelect(row.id)
          } else {
            navigation.navigate({
              name: 'UserEdit',
              params: { userName: row.username, name },
            })
          }
        }}
      >
        <Card.Content>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{name}</Text>

            <View
              style={{
                padding: 5,
                backgroundColor: active ? '#32a852' : '#d90000',
                alignSelf: 'flex-start',
                borderRadius: 4,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#FFF', marginRight: 5 }}>
                {active ? 'Active' : 'Inactive'}
              </Text>
              <MaterialIcons
                name={active ? 'check-circle' : 'cancel'}
                color='#FFF'
                size={15}
              />
            </View>
          </View>

          <Text style={{ fontSize: 14 }}>User Type: {user_type}</Text>
          <Text style={{ fontSize: 14, color: 'gray' }}>
            Last login: {last_login.formatted_date}
          </Text>

          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{active}</Text>
        </Card.Content>
      </Card>
    )
  }
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <HeaderLinkTree links={['Settings', 'Users']} />
        <Appbar.Action icon='filter' onPress={() => setFilterModal(true)} />
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>

      <Paginator onChangePage={onPaginate} tableViewInfo={tableViewInfo} />
      {onSelection && (
        <View
          style={{
            backgroundColor: '#FFF',
            padding: 10,
            borderTopColor: 'gray',
            borderTopWidth: 0.5,
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ width: '60%' }}>
            <SinglePicker
              style={{}}
              list={bulkOptions}
              id='value'
              label='label'
              selectedValue={bulkAction}
              onChangeValue={(value) => onChangeBulkAction(value.value)}
            />
          </View>

          <Button
            style={{ width: '30%' }}
            mode='contained'
            onPress={applyBulkAction}
          >
            Apply
          </Button>
        </View>
      )}
      <View style={styles.content}>
        {userList.length > 0 && (
          <>
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{ width: '100%' }}
              data={userList}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContainer}
            />
          </>
        )}
      </View>

      <Modal visible={filterModal} transparent animationType='fade'>
        <FilterBox
          defaultValues={filterValues}
          onClose={() => setFilterModal(false)}
          onChangeFilter={onChangeFilter}
          userList={userList}
          userTypeList={userTypeList}
        />
      </Modal>
      <Modal visible={addNewUserModal} transparent animationType='fade'>
        <UserCreate
          userTypeList={userTypeList}
          onUserCreated={onUserCreated}
          onClose={() => setAddNewUserModal(false)}
        />
      </Modal>

      <FAB
        style={styles.fab}
        small
        icon='plus'
        onPress={() => {
          setAddNewUserModal(true)
        }}
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
    paddingBottom: 100,
    width: '100%',
  },
  card: {
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
})

const mapStateToProps = (state) => ({
  users: state.admin.userList.users,
  bulkUpdated: state.admin.bulkUpdated,
})

const mapDispatchToProps = (dispatch) => ({
  userBulkAction: bindActionCreators(userBulkAction, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(UsersList)
