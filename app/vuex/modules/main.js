// vuex/modules/login.js
import {
  SET_MESCONTENT,
  TOGGLE_SETTING,
  ADD_FEEDBACK
} from '../mutation-types'
import Feedback from '../models/feedbackModel'

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
  },
  [ADD_FEEDBACK](state, userid, feedbackDesc) {
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
    let feedbackArray = {
      userid: userid,
      created_time: getNowFormatDate(),
      feedback_desc: feedbackDesc
    }
    Feedback.create(feedbackArray, function (err, result) {
      if (err) {
        console.log(err);
      }
    });
  }
}

export default {
  state,
  mutations
}
