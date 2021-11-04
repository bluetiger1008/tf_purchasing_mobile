import React, { useEffect, useState, useContext } from 'react'
import {
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { Text, Button, TextInput } from 'react-native-paper'
import axios from 'axios'
import { fetchUserSupplierListAPI } from 'services/helpers/apis/user'
import { updateSupplierProfileAPI } from 'services/helpers/apis/supplier'
import adminActions from 'services/redux/admin/actions'
import { ShowControl } from 'components'
import _filter from 'lodash/filter'
import { useDispatch } from 'react-redux'
import { GlobalContext } from '../../../../../Main'
import { MaterialIcons } from '@expo/vector-icons'

const WAIT_INTERVAL = 500
let timer

const { fetchUserList } = adminActions

const EmptyUserProfileForm = ({
  linkedUser,
  uuid,
  navigation,
  onClose,
  onUserConnected,
}) => {
  const context = useContext(GlobalContext)
  const signal = axios.CancelToken.source()
  const [userList, setUserList] = useState([])
  const [filteredUserList, setFilteredUserList] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const dispatch = useDispatch()

  const fetchUserSupplierList = async () => {
    try {
      const res = await fetchUserSupplierListAPI(signal.token)
      setUserList(res.data.data.users)
    } catch (e) {
      context.onApiError(e)
    }
  }

  useEffect(() => {
    fetchUserSupplierList()

    return () => {
      signal.cancel('Api is being canceled')
    }
  }, [])

  const onSearchChange = (value) => {
    clearTimeout(timer)
    setSearchValue(value)
    timer = setTimeout(async () => {
      const filterUsers = _filter(userList, function (o) {
        return o.name.toUpperCase().includes(value.toUpperCase())
      })

      if (value == '') {
        setFilteredUserList([])
      } else {
        setFilteredUserList(filterUsers)
      }
    }, WAIT_INTERVAL)
  }

  const onSelectUser = async (user) => {
    setSearchValue(user.name)
    onClose()
    try {
      await updateSupplierProfileAPI(uuid, {
        linked_user_id: user.id,
      })
      onUserConnected(user)
    } catch (e) {
      context.onApiError(e)
    }
  }

  return (
    <View style={styles.modal_wrapper}>
      <View style={styles.content}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Add Contact</Text>
        <TextInput
          style={{
            backgroundColor: '#FFF',
            marginVertical: 0,
            paddingVertical: 0,
          }}
          label={'Search'}
          onChangeText={onSearchChange}
        />
        <ScrollView style={{ flexGrow: 1, padding: 2 }}>
          <ShowControl visible={filteredUserList.length > 0}>
            {filteredUserList.map((user, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => onSelectUser(user)}
                  style={{
                    paddingVertical: 10,
                    borderBottomColor: 'gray',
                    borderBottomWidth: 0.5,
                    backgroundColor: '#FFF',
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>
                    {user.name}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ShowControl>
          <ShowControl visible={filteredUserList.length == 0}>
            <Text style={{ alignSelf: 'center', color: 'gray' }}>
              Type to search contacts
            </Text>
          </ShowControl>
        </ScrollView>
        <Button style={styles.button} mode='contained' onPress={() => {}}>
          Add
        </Button>

        <MaterialIcons
          style={{ position: 'absolute', top: 10, right: 10 }}
          name='close'
          size={20}
          color='gray'
          onPress={onClose}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 7,
  },
  modal_wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: '#0000004D',
  },
  content: {
    width: '90%',
    height: Dimensions.get('window').height * 0.6,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
  },
  user_item: {
    paddingVertical: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    backgroundColor: '#FFF',
  },
})
export default EmptyUserProfileForm
