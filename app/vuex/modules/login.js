// vuex/modules/login.js
import {
  TOGGLE_LOADING,
  TOGGLE_LOGIN,
  SET_USERNAME
} from '../mutation-types'

// initial state
const state = {
  loading: false,
  isLogin: false,
  userName: ''
}

// mutations
const mutations = {
  [TOGGLE_LOADING](state) {
    state.loading = !state.loading
  },

  [TOGGLE_LOGIN](state) {
    state.isLogin = !state.isLogin
  },

  [SET_USERNAME](state, userName) {
    state.userName = userName
  }
}

export default {
  state,
  mutations
}
