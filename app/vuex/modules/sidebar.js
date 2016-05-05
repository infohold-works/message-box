// vuex/modules/login.js
import {
  SET_MESSAGETYPES,
  TOGGLE_ROUTER,
  INCREASE_COUNT,
  DECREASE_COUNT
} from '../mutation-types'

// initial state
const state = {
  messageTypes: [],
  router: {
    isAll: true,
    isRead: false,
    isUnRead: false,
    isType: false
  }
}

// mutations
const mutations = {
  [SET_MESSAGETYPES](state, mesTypes, data) {
    for (var i = 0; i < mesTypes.length; i++) {
      state.messageTypes.push({
        id: i + 1,
        title: mesTypes[i],
        count: data[i].count,
        selected: false
      })
    }
  },
  [TOGGLE_ROUTER](state, route, mesTypes, messageType) {
    for (var key in state.router) {
      key == route ? state.router[key] = true : state.router[key] = false;
      for (var i in mesTypes) {
        state.messageTypes[i].selected = false;
      }
    }
    if (route == 'isType') {
      for (var j in mesTypes) {
        j == messageType.id - 1 ? state.messageTypes[j].selected = true : state.messageTypes[j].selected = false;
      }
    }
  },
  [INCREASE_COUNT](state, typeid) {
    console.log('+1');
    state.messageTypes[typeid - 1].count += 1;
  },
  [DECREASE_COUNT](state, typeid) {
    console.log('-1');
    state.messageTypes[typeid - 1].count -= 1;
  }
}

export default {
  state,
  mutations
}
