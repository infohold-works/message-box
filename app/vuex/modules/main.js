// vuex/modules/login.js
import {
  SET_MESCONTENT,
  TOGGLE_SETTING
} from '../mutation-types'

// initial state
const state = {
  mescontent: '',
  showSetting: false
}

// mutations
const mutations = {
  [SET_MESCONTENT](state, mescontent) {
    state.mescontent = mescontent
  },
  [TOGGLE_SETTING](state) {
    state.showSetting = !state.showSetting
  }
}

export default {
  state,
  mutations
}
