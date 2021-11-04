import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { Appbar } from 'react-native-paper'
import AccordionItem from 'components/accordionItem'
import ProfileForm from '../../../user/edit/components/profileForm'
import ChangePasswordForm from '../../../user/edit/components/changePasswordForm'
import AuthenticatedBrowsers from '../../../user/edit/components/authenticatedBrowsers'
import UserMetaDataForm from '../../../user/edit/components/userMetaDataForm'
import adminActions from 'services/redux/admin/actions'
import { setPasswordAPI } from 'services/helpers/apis/user'
import _find from 'lodash/find'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const { readUser, updateUser, changePassword, onApiError } = adminActions

const EditContact = (props) => {
  const {
    navigation,
    route,
    userData,
    readUser,
    self,
    changePassword,
    updateUser,
    onApiError,
    users,
  } = props
  const { userName } = route.params
  const userProfileState = useState(true)
  const changePasswordState = useState(true)
  const authenticatedBrowserState = useState(true)
  const userMetaDataState = useState(true)

  const [editUserName, setEditUserName] = useState(null)
  const [userId, setUserId] = useState(null)

  const changePasswordValues = {
    newPassword: '',
    emailUserNewPassword: false,
    forceChangePassword: false,
  }

  useEffect(() => {
    const { self, users } = props

    const user = _find(users, function (x) {
      if (self) {
        return x.self === true
      }

      return x.username === userName
    })

    setUserId(user.id)

    if (self) {
      readUser('self')
      setEditUserName('self')
    } else {
      setEditUserName(userName)
      readUser(userName)
    }
  }, [])

  const profileFormSubmit = (values) => {
    const userData = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone: values.phone,
    }

    this.props.updateUser(editUserName, userData)
  }

  const onChangePassword = async (values) => {
    if (self) {
      const passwords = {
        old_password: values.oldPassword,
        new_password: values.newPassword,
      }

      changePassword(editUserName, passwords)
    } else {
      const updateData = {
        user_id: userId,
        password: values.newPassword,
        send_email: values.emailUserNewPassword,
        force_password_change: values.forceChangePassword,
      }

      try {
        const res = await setPasswordAPI(updateData)
        if (res.data.code === 201) {
          if (res.data.message) {
            toast.success(res.data.message)
          } else {
            toast.success('Password Changed')
          }
        } else {
          toast.warn(res.data.message)
        }
      } catch (error) {
        onApiError(error)
      } finally {
      }
    }
  }
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title='Edit Contact' subtitle='' />
        <Appbar.Action
          icon='menu'
          onPress={() => {
            navigation.openDrawer()
          }}
        />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.content}>
        {userData && userId && (
          <>
            <AccordionItem
              style={styles.accordion}
              title='User Profile'
              showState={userProfileState}
            >
              <ProfileForm
                initialValues={userData}
                onSubmit={profileFormSubmit}
              />
            </AccordionItem>
            <AccordionItem
              showState={changePasswordState}
              style={styles.accordion}
              title='Change Password'
            >
              <ChangePasswordForm
                self={self}
                onSubmit={onChangePassword}
                defaultValues={changePasswordValues}
              />
            </AccordionItem>
            <AccordionItem
              showState={authenticatedBrowserState}
              style={styles.accordion}
              title='Authenticated Browser'
            >
              <AuthenticatedBrowsers
                tokenObject={userData.token_object}
                userId={userId}
                self={self}
              />
            </AccordionItem>
            <AccordionItem
              showState={userMetaDataState}
              style={styles.accordion}
              title='User Metadata'
            >
              <UserMetaDataForm
                userData={userData}
                userId={userId}
                self={self}
                users={users}
              />
            </AccordionItem>
          </>
        )}
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    padding: 20,
  },
  button: {
    marginVertical: 7,
    marginTop: 12,
  },
  accordion: {
    marginBottom: 10,
  },
})

const mapStateToProps = (state) => ({
  userData: state.admin.userData,
  users: state.admin.userList.users,
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      readUser,
      updateUser,
      changePassword,
      onApiError,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(EditContact)
