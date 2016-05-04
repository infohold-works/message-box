// vuex/modules/login.js
import {
    TOGGLE_ROUTER
} from '../mutation-types'

// initial state
const state = {
    router: {
        isAll: true,
        isRead: false,
        isUnRead: false,
        isType: false
    }
}

// mutations
const mutations = {
    [TOGGLE_ROUTER](state, route) {
        for (var key in state.router) {
            key == route
            ? state.router[key] = true
            : state.router[key] = false
        }
    }
}

export default {
    state,
    mutations
}
