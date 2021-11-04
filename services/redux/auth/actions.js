const authActions = {
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_REJECT: 'LOGIN_REJECT',

  FORGOT_PASSWORD_REQUEST: 'FORGOT_PASSWORD_REQUEST',
  FORGOT_PASSWORD_SUCCESS: 'FORGOT_PASSWORD_SUCCESS',
  FORGOT_PASSWORD_REJECT: 'FORGOT_PASSWORD_REJECT',

  UPDATE_PASSWORD_REQUEST: 'UPDATE_PASSWORD_REQUEST',
  UPDATE_PASSWORD_SUCCESS: 'UPDATE_PASSWORD_SUCCESS',
  UPDATE_PASSWORD_REJECT: 'UPDATE_PASSWORD_REJECT',

  LOGOUT_REQUEST: 'LOGOUT_REQEST',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  LOGOUT_REJECT: 'LOGOUT_REJECT',
  SET_LOGIN_STATUS: 'SET_LOGIN_STATUS',

  login: (authData) => ({
    type: authActions.LOGIN_REQUEST,
    payload: {
      authData,
    },
  }),

  forgotPassword: (userName) => ({
    type: authActions.FORGOT_PASSWORD_REQUEST,
    payload: {
      userName,
    },
  }),

  updatePassword: (userName, passwords) => ({
    type: authActions.UPDATE_PASSWORD_REQUEST,
    payload: {
      userName,
      passwords,
    },
  }),

  logout: () => ({
    type: authActions.LOGOUT_REQUEST,
  }),
}

export default authActions
