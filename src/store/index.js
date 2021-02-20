export default {
  onAuthStateChanged ({ commit }, authUser) {
    if (!authUser) {
      commit('RESET_STORE')
      return
    }
    console.log('onAuthStateChanged index authUser', authUser)
    commit('SET_AUTH_USER', authUser)
  }
}
