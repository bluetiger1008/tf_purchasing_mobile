import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, Picker } from 'react-native'
import { Button } from 'react-native-paper'
import { ShowControl } from 'components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { fetchUserTypeListAPI } from 'services/helpers/apis/user'
import { SinglePicker } from 'components'
// import { addMFAAPI, removeMFAAPI, bulkUserMakeActiveAPI, bulkUserMakeInactiveAPI } from 'services/helpers/apis/user'

import adminActions from 'services/redux/admin/actions'
const { updateUser, onApiError } = adminActions

const UserMetaDataForm = (props) => {
  const { onApiError, userData, self, userId, updateUser } = props
  const [mfaModalOpen, setMfaModalOpen] = useState(false)
  const [userTypeChangeModalOpen, setUserTypeChangeModalOpen] = useState(false)
  const [disableMFAModalOpen, setDisableMFAModalOpen] = useState(false)

  const [mfaEnabled, setMfaEnabled] = useState(userData.mfa)
  const [requireMFA, setRequireMFA] = useState(userData.require_mfa)
  const [active, setActive] = useState(userData.require_mfa)
  const [userTypes, setUserTypes] = useState([])
  const [userType, setUserType] = useState(userData.user_type_id)
  const [mfaUpdateMode, setMfaUpdateMode] = useState('')
  useEffect(() => {
    ;(async () => {
      try {
        const userTypeList = await fetchUserTypeListAPI()
        setUserTypes(userTypeList.data.data)
      } catch (e) {
        onApiError(e)
      } finally {
      }
    })()
  }, [])

  // handleChange = (name) => (event) => {
  //   this.setState({ [name]: event.target.checked }, () => {
  //     if (name === 'requireMFA') {
  //       if (this.state.requireMFA) {
  //         addMFAAPI(userId)
  //           .then((res) => {
  //             if (res.data.code === 201) {
  //               toast.success('MFA Enabled')
  //             } else {
  //               toast.warn(res.data.message)
  //             }
  //           })
  //           .catch((err) => {
  //             this.props.onApiError(err)
  //           })
  //       } else {
  //         removeMFAAPI(userId)
  //           .then((res) => {
  //             if (res.data.code === 201) {
  //               toast.success('MFA Disabled')
  //             } else {
  //               toast.warn(res.data.message)
  //             }
  //           })
  //           .catch((err) => {
  //             this.props.onApiError(err)
  //           })
  //       }
  //     } else if (name === 'active') {
  //       if (this.state.active) {
  //         bulkUserMakeActiveAPI([userId])
  //           .then((res) => {
  //             if (res.data.code === 201 || res.data.code === 202) {
  //               toast.success('User is now active')
  //             } else {
  //               toast.warn(res.data.message)
  //             }
  //           })
  //           .catch((err) => {
  //             this.props.onApiError(err)
  //           })
  //       } else {
  //         bulkUserMakeInactiveAPI([userId])
  //           .then((res) => {
  //             if (res.data.code === 201 || res.data.code === 202) {
  //               toast.success('User is now inactive')
  //             } else {
  //               toast.warn(res.data.message)
  //             }
  //           })
  //           .catch((err) => {
  //             this.props.onApiError(err)
  //           })
  //       }
  //     }
  //   })
  // }

  const onUserTypeSelect = (value) => {
    setUserType(value)

    if (userData.scope_customizations) {
      setUserTypeChangeModalOpen(true)
    } else {
      updateUser(userData.username, {
        user_type_id: parseInt(this.state.userType, 10),
      })
    }
  }

  return (
    <View style={styles.content}>
      <Text style={{ fontSize: 15 }}>Last Login: {userData.last_login}</Text>
      <Text style={{ fontSize: 15, marginBottom: 10 }}>
        User Created: {userData.date_added}
      </Text>

      <ShowControl visible={!self && userTypes.length > 0}>
        <SinglePicker
          title='User Type'
          style={{ marginBottom: 10 }}
          list={userTypes}
          id='id'
          label='user_type'
          selectedValue={userType}
          onChangeValue={(value) => onUserTypeSelect(value.id)}
        />
      </ShowControl>

      <Text>
        {' '}
        Multrifactor Authentication is{' '}
        {!userData.mfa_required && !mfaEnabled ? 'not' : ''} enabled
      </Text>
      <ShowControl visible={mfaEnabled}>
        <Button style={styles.button} mode='contained' onPress={() => {}}>
          Disable
        </Button>
      </ShowControl>

      {/* <br />
        <p>
          Multrifactor Authentication is{' '}
          {!userData.mfa_required && !mfaEnabled ? 'not' : ''} enabled
          {mfaEnabled && (
            <Button
              variant='contained'
              color='primary'
              style={{ marginLeft: '20px' }}
              onClick={this.onMFADisable}
            >
              Disable
            </Button>
          )}
        </p>
        {!self && (
          <div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      this.state.requireMFA || userData.disable_mfa_checkbox
                    }
                    onChange={this.handleChange('requireMFA')}
                    value='requireMFA'
                    color='primary'
                    disabled={userData.disable_mfa_checkbox}
                  />
                }
                label='Require MFA'
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.active}
                    onChange={this.handleChange('active')}
                    value='active'
                    color='primary'
                  />
                }
                label='Active'
              />
            </div>
          </div>
        )}
        {self && !mfaEnabled && (
          <div className='form-action'>
            <Button
              variant='contained'
              color='primary'
              onClick={() => this.onUpdateMFA('enable')}
            >
              Enable MFA
            </Button>
          </div>
        )}
        {self && mfaEnabled && !requireMFA && (
          <div className='form-action'>
            <Button
              variant='contained'
              color='primary'
              onClick={() => this.onUpdateMFA('remove')}
            >
              Remove MFA
            </Button>
          </div>
        )} */}
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    paddingBottom: 10,
    paddingTop: 10,
  },
  button: {
    marginTop: 15,
    marginBottom: 5,
  },
})

const mapStateToProps = (state) => ({
  userUpdated: state.admin.userUpdated,
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateUser,
      onApiError,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(UserMetaDataForm)
