<script>
    var Sidebar = require('./components/Sidebar.vue')
    var Login = require('./components/Login.vue')

    module.exports = {
        name: "App",
        data: function() {
            return {
                isLogin: false,
                userName: '',
                typeId: '',
                markedRead: '',
                socket: ''
            }
        },
        components: {
            Login,
            Sidebar
        },
        events: {
            'markRead': function(typeid) {
                this.$broadcast('siderbar-markRead', typeid);
            },
            'markUnread': function(typeid) {
                this.$broadcast('siderbar-markUnread', typeid);
            },
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
            'notified': function() {
                console.log('into app notified func');
                this.$broadcast('public-message');
            },
            'newMessage': function(typeid){
                this.$broadcast('siderbar-newMessage', typeid);
            }
        }
    }
</script>
<template>
    <div class="login-style animated fadeIn" v-if="!isLogin">
        <login :is-login.sync="isLogin" :user-name.sync="userName" :socket.sync="socket" keep-alive></login>
    </div>
    <div class="dashboard animated fadeIn" v-if="isLogin">
        <sidebar :user-name.once="userName"></sidebar>
        <router-view :is-login.sync="isLogin" :user-name.once="userName" :socket.sync="socket"></router-view>
    </div>
</template>
