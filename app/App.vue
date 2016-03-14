<script>
    var Sidebar = require('./components/Sidebar.vue')
    var Login = require('./components/Login.vue')
    module.exports = {
        name: "App",
        data: function() {
            return {
                isLogin: false,
                typeId: '',
                markedRead: '',
            }
        },
        components: {
            Login,
            Sidebar
        },
        events: {
            'markRead': function(typeid) {
                this.$broadcast('siderbar-markRead',typeid);
            },
            'markUnread': function(typeid) {
                this.$broadcast('siderbar-markUnread',typeid);
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
            }
        }
    }
</script>
<template>
    <div class="login-style" v-if="!isLogin">
        <login :is-login.sync="isLogin"></login>
    </div>
    <div class="dashboard" v-if="isLogin">
        <sidebar></sidebar>
        <router-view></router-view>
    </div>
</template>
