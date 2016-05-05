// vuex/modules/login.js
import {
  TOGGLE_LOADING,
  TOGGLE_LOGIN
} from '../mutation-types'

// initial state
const state = {
  loading: false,
  isLogin: false
}

// mutations
const mutations = {
  [TOGGLE_LOADING] (state) {
    state.loading = !state.loading
  },

  [TOGGLE_LOGIN] (state) {
    state.isLogin = !state.isLogin
  }
}

export default {
  state,
  mutations
}
