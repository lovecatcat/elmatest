export default {
  SET_ISLOADING (state, payload) {
    console.log('commit mutations:SET_ISLOADING')
    state.isLoading = payload
  },
  SET_ISLOGIN (state, payload) {
    console.log('commit mutations:SET_ISLOGIN')
    state.isLogin = payload
  }
}
