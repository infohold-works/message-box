// vuex/store.js
import Vue from 'vue'
import Vuex from 'vuex'
// import parts from modules
import login from './modules/login'
import global from './modules/global'

const debug = process.env.NODE_ENV !== 'production'
Vue.use(Vuex)
Vue.config.debug = debug

export default new Vuex.Store({
  // combine sub modules
  modules: {
    login,
    global
  },
  strict: debug
})
