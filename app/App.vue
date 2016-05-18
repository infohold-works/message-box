<script>
  import store from './vuex/store'
  import Login from './components/Login.vue'
  import Sidebar from './components/Sidebar.vue'
  import Bootstrap from './components/plugins/Bootstrap.vue'
  import BootstrapSwitch from './components/plugins/BootstrapSwitch.vue'
  import Fab from './components/plugins/Fab.vue'
  import mongoose from 'mongoose'
  import env_conf from '../config/env_development.json'
  import {
    setModel
  } from './vuex/actions'
  mongoose.connect(env_conf.db.uri, env_conf.db.options)
  import User from './vuex/models/userModel'
  import Summary from './vuex/models/summaryModel'
  import Message from './vuex/models/messageModel'

  module.exports = {
    name: "App",

    store,

    data() {
      return {
        socket: ''
      }
    },

    vuex: {
      getters: {
        isLogin: ({
          login
        }) => login.isLogin
      },
      actions: {
        setModel
      }
    },

    ready() {
      this.setModel(User, Summary, Message)
    },

    events: {
      'searchAll': function() {
        this.$broadcast('summaries-searchAll');
      },
      'searchRead': function() {
        this.$broadcast('summaries-searchRead');
      },
      'searchUnread': function() {
        this.$broadcast('summaries-searchUnread');
      },
      'searchType': function(id) {
        this.$broadcast('summaries-searchType', id);
      }
    },

    components: {
      Login,
      Sidebar,
      Bootstrap,
      BootstrapSwitch,
      Fab
    }
  }
</script>
<template>
  <div id="app">
    <div class="login-style animated fadeIn" v-if="!isLogin">
      <login :socket.sync="socket"></login>
    </div>
    <div class="dashboard animated fadeIn" v-if="isLogin">
      <sidebar></sidebar>
      <router-view :socket.sync="socket"></router-view>
    </div>
  </div>
</template>
