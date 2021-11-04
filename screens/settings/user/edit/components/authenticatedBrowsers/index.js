import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button, Text } from 'react-native-paper'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import adminActions from 'services/redux/admin/actions'

const { revokeBrowser, revokeAllBrowser } = adminActions

const AuthenticatedBrowsers = (props) => {
  const {
    revokeBrowser,
    revokeAllBrowser,
    self,
    editable,
    tokenObject,
    userId,
  } = props

  const revokeAll = () => {
    revokeAllBrowser(userId, self)
  }

  const revoke = (tokenObject) => {
    revokeBrowser(tokenObject)
  }
  return (
    <View style={styles.content}>
      {editable && tokenObject && tokenObject.length > 0 && (
        <View>
          <Text>Force logout from all browsers</Text>
          <Button
            style={styles.button}
            disabled={pristine}
            mode='contained'
            onPress={revokeAll}
          >
            Revoked All
          </Button>
        </View>
      )}
      {tokenObject &&
        tokenObject.map((object) => (
          <View key={object.token}>
            <View>
              <Text>{object.current_token} && current session</Text>
              <Text> {object.browser_user_agent}</Text>

              <Text> IP Address: {object.ip_address}</Text>
            </View>
            {editable && (
              <Button
                style={styles.button}
                disabled={pristine}
                mode='contained'
                onPress={() => revoke(object)}
              >
                Revoke
              </Button>
            )}
          </View>
        ))}
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    paddingBottom: 10,
  },
  button: {
    marginTop: 15,
    marginBottom: 5,
  },
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ revokeBrowser, revokeAllBrowser }, dispatch)

export default connect(null, mapDispatchToProps)(AuthenticatedBrowsers)
