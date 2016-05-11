// vuex/modules/global.js
import {
  SET_MODEL
} from '../mutation-types'

// initial state
const state = {
  User: '',
  Summary: '',
  Message: ''
}

// mutations
const mutations = {
  [SET_MODEL](state, User, Summary, Message) {
    state.User = User
    state.Summary = Summary
    state.Message = Message
  }
}

export default {
  state,
  mutations
}
