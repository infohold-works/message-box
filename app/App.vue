<script>
    import store from './vuex/store'
    var Sidebar = require('./components/Sidebar.vue')
    var Login = require('./components/Login.vue')

    module.exports = {
        name: "App",

        store,

        data () {
            return {
                socket: ''
            }
        },

        vuex: {
            getters: {
                isLogin: ({ login }) => login.isLogin,
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
            Sidebar
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
