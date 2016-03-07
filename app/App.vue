<script>
    var Sidebar = require('./components/Sidebar.vue')
    var Login = require('./components/Login.vue')

    module.exports = {
        name: "App",

        data: function () {
            return {
                isLogin: false
            }
        },

        components: {
            Login,
            Sidebar
        }
    }
</script>
<template>
    <div class="login-style"  v-if="!isLogin">
        <login :msg.sync="isLogin"></login>
    </div>
    <div class="dashboard" v-if="isLogin">
        <sidebar></sidebar>
        <router-view></router-view>
    </div>
</template>
