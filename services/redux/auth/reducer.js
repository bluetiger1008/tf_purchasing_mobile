import actions from './actions'
// import { getToken } from '../../helpers/utility'

const initState = {
  loading: false,
  authData: null,
  loginStatus: null,
  loggedIn: false,
  username: null,
}

export default function authReducer(
  state = {
    ...initState,
    // ...getToken(),
  },
  action
) {
  switch (action.type) {
    case actions.LOGIN_REQUEST:
    case actions.FORGOT_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case actions.LOGIN_REJECT:
      return {
        ...state,
        loading: false,
      }
    case actions.SET_LOGIN_STATUS:
      return {
        ...state,
        loading: false,
        authData: action.payload.authData,
        loginStatus: action.payload.loginStatus,
      }
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        username: action.payload.username,
      }
    case actions.LOGOUT_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case actions.LOGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        loggedIn: false,
        authData: null,
        loginStatus: null,
        username: null,
      }
    case actions.FORGOT_PASSWORD_REJECT:
    case actions.FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    default:
      return state
  }
}
