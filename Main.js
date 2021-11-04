import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack'
import FlashMessage from 'react-native-flash-message'
import { showMessage } from 'react-native-flash-message'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'

import { useDispatch, useSelector } from 'react-redux'

import HomeScreen from './screens/home'
import LoginScreen from './screens/auth/login'
import ForgotScreen from './screens/auth/forgot'
import GoogleAuthenticator from './screens/auth/googleAuthenticator'
import RequisitionsScreen from './screens/requisitions'
import PosScreen from './screens/pos'
import ShipmentsScreen from './screens/shipments'
import RfqsScreen from './screens/rfqs'
import SettingsScreen from './screens/settings'
import CreateUserScreen from './screens/admin/create'
import CorrespondenceMessages from './components/correspondence'
import SearchScreen from './screens/search'
import authActions from './services/redux/auth/actions'
import { clearToken } from './services/helpers/utility'
import { navigationRef } from './RootNavigation'

import colors from 'common/colors'

const Drawer = createDrawerNavigator()
const RootStack = createStackNavigator()

const { logout } = authActions

const theme = {
  ...DefaultTheme,
  roundness: 2,
  myOwnProperty: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: '#f1c40f',
    myOwnColor: '#BADA55',
  },
}

export const GlobalContext = React.createContext(null)

const Main = () => {
  const authData = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const onLogout = () => {
    dispatch(logout())
  }

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: authData.loggedIn,
      }}
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem label='Logout' onPress={onLogout} />
          </DrawerContentScrollView>
        )
      }}
    >
      {!authData.loggedIn ? (
        <>
          <Drawer.Screen name='Login' component={LoginScreen} />
          <Drawer.Screen name='Forgot' component={ForgotScreen} />
          <Drawer.Screen name='Authenticator' component={GoogleAuthenticator} />
        </>
      ) : (
        <>
          <Drawer.Screen name='Home' component={HomeScreen} />
          <Drawer.Screen name='Requisitions' component={RequisitionsScreen} />
          <Drawer.Screen name='Purchase Orders' component={PosScreen} />
          <Drawer.Screen name='Shipments' component={ShipmentsScreen} />
          <Drawer.Screen name='RFQs' component={RfqsScreen} />
          <Drawer.Screen name='Settings' component={SettingsScreen} />
        </>
      )}
    </Drawer.Navigator>
  )
}

const RootStackScreen = () => {
  const dispatch = useDispatch()

  const onApiError = async (err, overrideErrorMessage) => {
    let errorMessage = 'Error Api request'

    if ((err && err.response) || overrideErrorMessage) {
      if (err.response.data.code === 401) {
        await clearToken()
        dispatch({
          type: authActions.LOGOUT_SUCCESS,
        })
      } else {
        errorMessage = err.response.data.message
      }

      showMessage({
        message: errorMessage || overrideErrorMessage,
        type: 'danger',
        duration: 5000,
        icon: 'danger',
      })
    } else {
      showMessage({
        message: 'Error API',
        type: 'danger',
        duration: 5000,
        icon: 'danger',
      })
    }
  }

  const onApiSuccess = async (successMessage, duration = 5000) => {
    showMessage({
      message: successMessage,
      type: 'success',
      icon: 'success',
      duration,
    })
  }

  return (
    <GlobalContext.Provider value={{ onApiError, onApiSuccess }}>
      <PaperProvider theme={theme}>
        <NavigationContainer ref={navigationRef}>
          <RootStack.Navigator mode='modal'>
            <RootStack.Screen
              name='Main'
              component={Main}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
              name='CorrespondenceMessages'
              component={CorrespondenceMessages}
              options={{ headerShown: false }}
            />
          </RootStack.Navigator>
          <FlashMessage position='top' />
        </NavigationContainer>
      </PaperProvider>
    </GlobalContext.Provider>
  )
}

export default RootStackScreen
