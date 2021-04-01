/* eslint-disable no-throw-literal */
import { firestoreAction } from 'vuexfire'

export default {
  async nuxtServerInit ({ dispatch, commit }, ctx) {
    if (this.$fire.auth === null) {
      throw 'nuxtServerInit Example not working - this.$fire.auth cannot be accessed.'
    }

    if (ctx.$fire.auth === null) {
      throw 'nuxtServerInit Example not working - ctx.$fire.auth cannot be accessed.'
    }

    if (ctx.app.$fire.auth === null) {
      throw 'nuxtServerInit Example not working - ctx.$fire.auth cannot be accessed.'
    }

    // INFO -> Nuxt-fire Objects can be accessed in nuxtServerInit action via this.$fire___, ctx.$fire___ and ctx.app.$fire___'

    console.log('nuxtServerInit 1', ctx.res.locals)

    /** Get the VERIFIED authUser from the server */
    if (ctx.res && ctx.res.locals && ctx.res.locals.user) {
      console.log('nuxtServerInit 2', ctx.res.locals)

      const { allClaims: claims, ...authUser } = ctx.res.locals.user

      console.log('ctx.res.locals.user.idToken', ctx.res.locals.user)
      commit('SET_TOKEN', ctx.res.locals.user.idToken)

      console.info(
        'Auth User verified on server-side. User: ',
        authUser,
        'Claims:',
        claims
      )

      await dispatch('onAuthStateChanged', {
        authUser,
        claims
      })
    }
  },

  onAuthStateChanged ({ commit }, { authUser, claims }) {
    console.log('onAuthStateChanged', authUser)
    if (!authUser) {
      commit('RESET_STORE')
      return
    }
    commit('SET_AUTH_USER', authUser)
  },

  getUsers: firestoreAction(async function ({ state, bindFirestoreRef }) {
    const res = this.$fire.firestore
      .collection('users')
    await bindFirestoreRef('users', res, { wait: true })
  }),

  getUser: firestoreAction(async function ({ state, bindFirestoreRef }, ctx) {
    const { uid } = ctx
    console.log('getUser uid', uid)
    const res = this.$fire.firestore
      .collection('users')
      .doc(uid)

    await bindFirestoreRef('user', res, { wait: true })
  }),

  getThoughts: firestoreAction(async function ({ state, bindFirestoreRef }, ctx) {
    const { uid } = ctx
    const res = this.$fire.firestore
      .collection('thoughts')
      .where('uid', '==', uid)
      .orderBy('date', 'desc').limit(100)

    await bindFirestoreRef('thoughts', res, { wait: true })
  }),

  getDataSavingTime: firestoreAction(async function ({ state, bindFirestoreRef }, ctx) {
    const { uid } = ctx
    const res = this.$fire.firestore
      .collection('dataSavingTime')
      .where('uid', '==', uid)
      .orderBy('date', 'desc').limit(5)

    await bindFirestoreRef('dataSavingTime', res, { wait: true })
  }),

  getAlerts: firestoreAction(async function ({ state, bindFirestoreRef }, ctx) {
    const { uid } = ctx
    const res = this.$fire.firestore
      .collection('alerts')
      .where('uid', '==', uid)
      .orderBy('date', 'desc').limit(100)

    await bindFirestoreRef('alerts', res, { wait: true })
  }),

  getValues: firestoreAction(async function ({ state, bindFirestoreRef }, ctx) {
    console.log('get.values')
    const res = this.$fire.firestore
      .collection('values')

    await bindFirestoreRef('values', res, { wait: true })
  }),

  getDataSet: firestoreAction(async function ({ state, bindFirestoreRef }, ctx) {
    const { uid } = ctx
    console.log('getDataSet uid', uid)
    const res = this.$fire.firestore
      .collection('dataSet')
      .where('uid', '==', uid)
      .orderBy('startTimeMillis', 'desc').limit(400)

    await bindFirestoreRef('dataSet', res, { wait: true })
  }),

  getDevices: firestoreAction(async function ({ state, bindFirestoreRef }, ctx) {
    const { uid } = ctx

    console.log('getDevices uid', uid)

    const res = this.$fire.firestore
      .collection('devices')
      .doc(uid)

    await bindFirestoreRef('devices', res, { wait: true })
  }),

  getDataSourceByUser: firestoreAction(async function ({ state, bindFirestoreRef }) {
    const { uid } = state.authUser
    const res = this.$fire.firestore
      .collection('dataSources')
      .doc(uid)

    await bindFirestoreRef('dataSource', res, { wait: true })
  })
}
