import initialState from './state'

export default {
  RESET_STORE: (state) => {
    Object.assign(state, initialState())
  },

  SET_AUTH_USER: (state, authUser) => {
    console.log('authUser', authUser)
    state.authUser = {
      uid: authUser.uid,
      email: authUser.email,
      idToken: authUser.refreshToken
    }
  },

  SET_TOKEN: (state, token) => {
    console.log('token', token)
    state.token = token
  },

  SET_CREDENTIAL: (state, credential) => {
    console.log('credential', credential)
    state.credential = credential
  },

  SET_DATA_SOURCE: (state, dataSource) => {
    console.log('dataSource', dataSource)
    state.dataSource = dataSource
  }
}
