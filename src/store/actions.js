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
    console.log('onAuthStateChanged actions authUser', authUser)
    commit('SET_AUTH_USER', authUser)
  },

  getUsers: firestoreAction(async function ({ state, bindFirestoreRef }) {
    const res = this.$fire.firestore
      .collection('users')
    await bindFirestoreRef('users', res, { wait: true })
  }),

  getThoughts: firestoreAction(async function ({ state, bindFirestoreRef }, ctx) {
    console.log('getThoughts ctx', ctx)
    const { uid } = ctx
    const res = this.$fire.firestore
      .collection('thoughts')
      .where('uid', '==', uid)

    await bindFirestoreRef('thoughts', res, { wait: true })
  }),

  getAlerts: firestoreAction(async function ({ state, bindFirestoreRef }, ctx) {
    console.log('getAlerts ctx', ctx)
    const { uid } = ctx
    const res = this.$fire.firestore
      .collection('alerts')
      .where('uid', '==', uid)

    await bindFirestoreRef('alerts', res, { wait: true })
  }),

  getDataSourceByUser: firestoreAction(async function ({ state, bindFirestoreRef }) {
    console.log('getDataSourceByUser state', state)
    const { uid } = state.authUser
    const res = this.$fire.firestore
      .collection('dataSources')
      .doc(uid)

    await bindFirestoreRef('dataSource', res, { wait: true })
  })
}
