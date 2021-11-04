import React, { useContext, useState, useEffect } from 'react'
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native'
import { Text, Button } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux'
import { unlinkUserSupplierAPI } from 'services/helpers/apis/supplier'
import {
  deleteUserAPI,
  updateSupplierProfileAPI,
} from 'services/helpers/apis/user'
import { GlobalContext } from '../../../../../Main'
import adminActions from 'services/redux/admin/actions'
import EmptyUserProfileForm from '../emptyUserProfileForm'
import UserCreateForm from '../../../user/create'

const { resetUserData, fetchUserList } = adminActions
const AssociatedUserProfileForm = ({ linkedUser, uuid, navigation }) => {
  const context = useContext(GlobalContext)
  const [connectedUser, setConnectedUser] = useState(
    linkedUser
      ? {
          ...linkedUser,
          name: `${linkedUser.first_name} ${linkedUser.last_name}`,
        }
      : null
  )

  const [addUserModal, setAddUserModal] = useState(false)
  const [addNewUserModal, setAddNewUserModal] = useState(false)
  const userData = useSelector((state) => state.admin.userData)
  const [isEdit, setIsEdit] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (userData && isEdit) {
      setConnectedUser({
        ...userData,
        name: `${userData.first_name} ${userData.last_name}`,
      })
    }
  }, [userData])

  const onDeleteContact = async (user) => {
    try {
      await deleteUserAPI(user.id)
      context.onApiSuccess('User is successfully deleted')
      setConnectedUser(null)
      dispatch(resetUserData())
    } catch (error) {
      context.onApiError(error)
    }
  }

  const onUnlinkContact = async () => {
    try {
      context.onApiSuccess('Trying')
      await unlinkUserSupplierAPI(uuid)
      setConnectedUser(null)
      dispatch(resetUserData())
      context.onApiSuccess('User is successfully unlinked')
    } catch (error) {
      context.onApiError(error)
    }
  }

  const onUserConnected = (user) => {
    setConnectedUser(user)
  }

  const onSelectUser = async (user) => {
    try {
      await updateSupplierProfileAPI(uuid, {
        linked_user_id: user.id,
      })
      onUserConnected(user)
    } catch (e) {
      context.onApiError(e)
    }
  }

  const onUserCreated = (user) => {
    setAddNewUserModal(false)
    onSelectUser(user)
    dispatch(fetchUserList())
  }

  if (connectedUser) {
    return (
      <View style={{ paddingBottom: 20, paddingTop: 10 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          {connectedUser.name}
        </Text>
        <Text style={{ fontSize: 13 }}>{connectedUser.email}</Text>
        <Text style={{ fontSize: 13 }}>{connectedUser.phone}</Text>
        <Button
          style={{ ...styles.button, marginTop: 12 }}
          mode='contained'
          color='red'
          onPress={() => onDeleteContact(connectedUser)}
        >
          Delete
        </Button>
        <Button
          style={styles.button}
          mode='contained'
          color='orange'
          onPress={onUnlinkContact}
        >
          Unlink
        </Button>
        <Button
          style={styles.button}
          mode='contained'
          onPress={() => {
            setIsEdit(true)
            navigation.navigate({
              name: 'SupplierEditContact',
              params: { userName: connectedUser.username },
            })
          }}
        >
          Edit
        </Button>
      </View>
    )
  } else {
    return (
      <>
        <View style={{ paddingVertical: 20 }}>
          <Button
            style={styles.button}
            mode='contained'
            onPress={() => setAddUserModal(true)}
          >
            Add Contact from List
          </Button>
          <Button
            style={styles.button}
            mode='contained'
            color='red'
            onPress={() => setAddNewUserModal(true)}
          >
            Add New Contact
          </Button>
        </View>

        <Modal visible={addUserModal} transparent animationType='fade'>
          <EmptyUserProfileForm
            onClose={() => {
              setIsEdit(false)
              setAddUserModal(false)
            }}
            uuid={uuid}
            onUserConnected={onUserConnected}
          />
        </Modal>

        <Modal visible={addNewUserModal} transparent animationType='fade'>
          <UserCreateForm
            isUpdateSupplier
            onUserCreated={onUserCreated}
            onClose={() => setAddNewUserModal(false)}
          />
        </Modal>
      </>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 7,
  },
})

export default AssociatedUserProfileForm
