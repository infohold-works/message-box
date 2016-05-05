<script>
  import store from './vuex/store'
  import Login from './components/Login.vue'
  import Sidebar from './components/Sidebar.vue'
  import Bootstrap from './components/plugins/Bootstrap.vue'

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
      }
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
      Bootstrap
    }
  }
</script>
<template>
  <div id="app">
    <div class="login-style animated fadeIn" v-if="!isLogin">
      <login :socket.sync="socket"></login>
    </div>
    <div class="dashboard animated fadeIn" v-if="isLogin">
      <sidebar :socket.sync="socket"></sidebar>
      <router-view :socket.sync="socket"></router-view>
    </div>
  </div>
</template>
