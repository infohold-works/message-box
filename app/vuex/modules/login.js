// vuex/modules/login.js
import {
  TOGGLE_LOADING,
  TOGGLE_LOGIN,
  SET_USER,
  SET_ERROR_MSG,
  UPDATE_USER
} from '../mutation-types'

// initial state
const state = {
  loading: false,
  isLogin: false,
  user: [],
  isOnline: '',
  errorMsg: ''
}

// mutations
const mutations = {
  [TOGGLE_LOADING](state) {
    state.loading = !state.loading
  },

  [TOGGLE_LOGIN](state) {
    state.isLogin = !state.isLogin
  },

  [SET_USER](state, docs) {
    state.user = docs
  },

  [SET_ERROR_MSG](state, errorMsg) {
    state.errorMsg = errorMsg
  },

  [UPDATE_USER](state, User, username) {
    let queryUser = User.findOne({username: username})
    // 生成格式化后的当前时间
    function getNowFormatDate() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      function format(arg) {
        var reg = /^\d{1}$/;
        return reg.test(arg) ? ("0" + arg) : arg;
      }
      return year + "-" + format(month) + "-" + format(day) + " " + format(hours) + ":" + format(minutes) + ":" + format(seconds);
    }
    queryUser.exec(function (err, docs) {
      if (docs !== null) {
        let query = {
          username: username
        }
        let doc = {
          $set: {
            online_stat: true,
            login_time: getNowFormatDate(),
            last_login_time: docs.login_time
          }
        }
        User.update(query, doc).exec()
      }
    })
  }
}

export default {
  state,
  mutations
}
