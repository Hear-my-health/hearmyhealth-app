import { vuexfireMutations } from 'vuexfire'
import initialState from './state'

export default {
  ...vuexfireMutations,

  RESET_STORE: (state) => {
    Object.assign(state, initialState())
  },

  SET_AUTH_USER: (state, authUser) => {
    state.authUser = {
      uid: authUser.uid,
      email: authUser.email,
      photoURL: authUser.photoURL,
      providerData: authUser.providerData[0],
      idToken: authUser.refreshToken
    }
  },

  SET_TOKEN: (state, token) => {
    state.token = token
  },

  SET_CREDENTIAL: (state, credential) => {
    state.credential = credential
  },

  SET_DATA_SOURCE: (state, dataSource) => {
    state.dataSource = dataSource
  },

  SET_THOUGHTS: (state, thoughts) => {
    state.thoughts = thoughts
  },

  SET_ALERTS: (state, alerts) => {
    state.alerts = alerts
  },

  SET_DATA_SET: (state, dataSet) => {
    state.dataSet = dataSet
  },

  SET_DEVICES: (state, devices) => {
    state.devices = devices
  },

  SET_VALUES: (state, values) => {
    state.values = values
  },

  SET_DATA_SAVING_TIME: (state, dataSavingTime) => {
    state.dataSavingTime = dataSavingTime
  }
}
