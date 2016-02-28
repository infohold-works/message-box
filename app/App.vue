<script>
    var Sidebar = require('./components/Sidebar.vue')

    module.exports = {
        name: "App",

        components: {
            Sidebar
        }
    }
</script>

<template>
    <div class="dashboard">
        <sidebar></sidebar>
        <router-view></router-view>
    </div>
</template>
