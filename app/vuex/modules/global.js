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
  [SET_SOCKET] (state, socket) {
    state.socket = socket
  }
}

export default {
  state,
  mutations
}
