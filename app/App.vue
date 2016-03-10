<script>
    var Sidebar = require('./components/Sidebar.vue')
    var Login = require('./components/Login.vue')

    module.exports = {
        name: "App",

        data: function () {
            return {
                isLogin: true,
                typeId: '',
                markRead: '',
            }
        },

        components: {
            Login,
            Sidebar
        },

        events: {
            'markRead': function() {
                this.$broadcast('siderbar-markRead');
            },
            'markUnread': function() {
                this.$broadcast('siderbar-markUnread');
            }
        }
    }
</script>
<template>
    <div class="login-style"  v-if="!isLogin">
        <login :msg.sync="isLogin"></login>
    </div>
    <div class="dashboard" v-if="isLogin">
        <sidebar :typeid.sync="typeId" :markread.sync="markRead"></sidebar>
        <router-view :typeid.sync="typeId" :markread.sync="markRead"></router-view>
    </div>
</template>
