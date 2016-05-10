// vuex/modules/login.js
import {
  TOGGLE_LOADING,
  TOGGLE_LOGIN,
  SET_USERNAME,
  UPDATE_USER
} from '../mutation-types'
import moment from 'moment'
import mongoose from 'mongoose'
import env_conf from '../../../config/env_development.json'
mongoose.connect(env_conf.db.url)
import User from '../models/userModel'

// initial state
const state = {
  loading: false,
  isLogin: false,
  username: ''
}

// mutations
const mutations = {
  [TOGGLE_LOADING](state) {
    state.loading = !state.loading
  },

  [TOGGLE_LOGIN](state) {
    state.isLogin = !state.isLogin
  },

  [SET_USERNAME](state, username) {
    state.username = username
  },

  [UPDATE_USER](state, username) {
    let queryUser = User.findOne({username: username})
    queryUser.exec(function (err, docs) {
      let query = {
        username: username
      }
      let doc = {
        $set: {
          online_stat: true,
          login_time: moment().format('YYYY-MM-DD HH:mm:ss'),
          last_login_time: docs.login_time
        }
      }
      let callback = function(err, result) {
        if (err) {
          console.log(err)
          return
        }
        console.log('Update user[' + username + ']')
      }
      User.update(query, doc, null, callback)
    });
  }
}

export default {
  state,
  mutations
}
