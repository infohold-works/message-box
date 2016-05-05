// vuex/modules/global.js
import {
  SET_SOCKET
} from '../mutation-types'

// initial state
const state = {
  socket: '',
}

// mutations
const mutations = {
  [SET_SOCKET] (state) {
    state.socket = !state.socket
  }
}

export default {
  state,
  mutations
}
