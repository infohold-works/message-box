<script>
    import store from './vuex/store'
    var Sidebar = require('./components/Sidebar.vue')
    var Login = require('./components/Login.vue')

    module.exports = {
        name: "App",

        store,

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
            },
            'markRead': function(typeid) {
                this.$broadcast('siderbar-markRead', typeid);
            },
            'markUnread': function(typeid) {
                this.$broadcast('siderbar-markUnread', typeid);
            },
            'newMessage': function(typeid){
                this.$broadcast('siderbar-newMessage', typeid);
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
        <login keep-alive></login>
      </div>
      <div class="dashboard animated fadeIn" v-if="isLogin">
        <sidebar></sidebar>
        <router-view></router-view>
      </div>
    </div>
</template>
