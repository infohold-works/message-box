<script>
  import {
    toggleLoading,
    toggleLogin,
    setMessagetypes
  } from '../vuex/actions'
  var Setting = require('./Setting.vue');
  var Confirm = require('./Confirm.vue');
  var ipcRenderer = require('electron').ipcRenderer;
  module.exports = {
    name: 'Header',

    data() {
      return {
        showSetting: false,
        showConfirm: false
      }
    },

    props: [
      'title',
      'socket'
    ],

    vuex: {
      getters: {
        user: ({
          login
        }) => login.user
      },
      actions: {
        toggleLoading,
        toggleLogin,
        setMessagetypes
      }
    },

    methods: {
      setting() {
        this.showSetting = true;
      },
      confirm() {
        this.showConfirm = true;
      },
      exit() {
        ipcRenderer.send('exit', 'exit');
      }
    },

    events: {
      confirmed() {
        var username = this.user.username;
        this.socket.emit('logout', {
          username: username
        });
        this.toggleLoading();
        this.setMessagetypes(null);
        this.toggleLogin();
      }
    },

    components: {
      Setting,
      Confirm
    }
  }
</script>
<template>
  <h4>{{ title }}</h4>
  <div class="btn-group pull-right">
    <section class="dropdown-toggle" data-toggle="dropdown">
      欢迎您,{{ user.username }}<span class="caret"></span>
    </section>
    <ul class="dropdown-menu" role="menu">
      <li><a href="#" @click="setting">设&emsp;&emsp;置</a></li>
      <li><a href="#">关于我们</a></li>
      <li class="divider"></li>
      <!-- <li><a href="#" @click="confirm">登&emsp;&emsp;出</a></li> -->
      <li><a href="#" @click="exit">退&emsp;&emsp;出</a></li>
    </ul>
  </div>
  <setting v-if="showSetting" :show.sync="showSetting"></setting>
  <confirm v-if="showConfirm" :show.sync="showConfirm" confirm-content="确认登出吗？"></confirm>
</template>
<style>
  .dashboard .dashboard-header {
    background: #fff;
    border-bottom: 1px solid rgba(55, 53, 112, 0.1);
    color: #fff;
    height: 60px;
    line-height: 60px;
    position: absolute;
    left: 192px;
    right: 0;
  }

  .dashboard .dashboard-header h4 {
    color: #2C3E50;
    font-size: 24px;
    display: inline-block;
    margin-left: 20px;
  }

  .dashboard .dashboard-header .settings-trigger {
    -webkit-transition: color 150ms linear;
    -moz-transition: color 150ms linear;
    transition: color 150ms linear;
    color: #658399;
    display: inline-block;
    font-size: 0.9rem;
    line-height: 1;
    margin-left: 5px;
    margin-right: 10px;
    top: -3px;
  }

  .dashboard-header .dropdown-toggle {
    color: #34495e;
    margin-right: 20px;
  }
  /* dropdown */

  .open .dropdown-toggle {
    color: #34495e !important;
  }

  .open .dropdown-menu,
  .dropdown-menu {
    margin: 8px !important;
    border: 1px solid rgba(55, 53, 112, 0.1);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
    background: #fff;
  }

  .dropdown-menu .divider {
    margin: 0;
  }

  .open .dropdown-menu li > a:hover {
    color: rgba(52, 73, 94, 0.75);
    background: #
  }
</style>
