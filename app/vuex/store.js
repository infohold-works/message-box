// vuex/store.js
import Vue from 'vue'
import Vuex from 'vuex'
// import parts from modules
import login from './modules/login'
import global from './modules/global'

Vue.use(Vuex)

export default new Vuex.Store({
  // combine sub modules
  modules: {
    login,
    global
  }
})
