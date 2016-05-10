<script>
  import {
    toggleLoading,
    toggleLogin,
    setUserName,
    updateUser
  } from '../vuex/actions'
  var env_conf = require('../../config/env_development.json');
  var socket = require('socket.io-client')(env_conf.socketServerUrl);
  var ScaleLoader = require('vue-spinner/src/ScaleLoader.vue');
  var storage = require('electron-json-storage');
  // var ipcRenderer = require('electron').ipcRenderer;
  // ipcRenderer.on('asynchronous-reply', function(event, arg) {
  //     console.log(arg); // prints "pong"
  // });
  // ipcRenderer.send('asynchronous-message', 'ping');
  module.exports = {
    name: "Login",

    data: function() {
      return {
        username: '',
        password: '',
        isChecked: false
      }
    },

    props: [
      'socket'
    ],

    vuex: {
      getters: {
        loading: ({
          login
        }) => login.loading
      },
      actions: {
        toggleLoading,
        toggleLogin,
        setUserName,
        updateUser
      }
    },

    ready: function() {
      // var self = this;
      this.socket = socket;
      // storage.get('login-user', function(error, data) {
      //   if (error) throw error;
      //   self.username = data.username;
      //   self.password = data.password;
      //   self.isChecked = data.isChecked;
      //   self.setUserName(data.username);
      // });
    },

    methods: {
      login: function() {
        // this.updateUser(this.username);
        this.toggleLogin();
      },
      savePasswd: function() {
        this.isChecked = true;
        storage.set('login-user', {
          isChecked: this.isChecked
        }, function(error) {
          if (error) throw error;
        });
      },
      removePasswd: function() {
        this.isChecked = false;
        storage.set('login-user', {
          password: '',
          isChecked: this.isChecked
        }, function(error) {
          if (error) throw error;
        });
      }
    },

    components: {
      ScaleLoader
    }
  }
</script>
<template>
  <div class="login-screen">
    <header class="login-screen-header">
      <h5>消息盒子</h5>
    </header>
    <!-- <pre>
      {{ $data | json }}
    </pre> -->
    <!-- <div class="alert alert-warning time-out" role="alert" :class="{'hidden':timeOut}">
      <a class="glyphicon glyphicon-remove-sign pull-right" href="#" @click="close"></a>
      <span>{{noticeError}}</span>
    </div> -->
    <div class="login-form">
      <validator name="loginValidation">
        <form novalidate>
          <div class="form-group" :class="{'has-error': $loginValidation.username.required}">
            <input type="text" class="form-control" value="" placeholder="用户名" v-validate:username="['required']">
            <label class="login-field-icon fui-user" for="login-name"></label>
            <span class="notice pull-right" v-if="$loginValidation.username.required">请输入用户名！</span>
          </div>
          <div class="form-group" :class="{'has-error': $loginValidation.password.required}">
            <input type="password" class="form-control" value="" placeholder="密码" v-validate:password="['required']">
            <label class="login-field-icon fui-lock" for="login-pass"></label>
            <span class="notice pull-right" v-if="$loginValidation.password.required">请输入密码！</span>
          </div>
          <label class="checkbox" for="checkbox">
            <input class="custom-checkbox" id="checkbox" data-toggle="checkbox" type="checkbox" @click="savePasswd" v-if="!isChecked">
            <input class="custom-checkbox" id="checkbox" data-toggle="checkbox" type="checkbox" @click="removePasswd" v-if="isChecked" checked="checked">
            <span class="icons">
              <span class="icon-unchecked"></span>
              <span class="icon-checked"></span>
            </span>
            保持登录状态
          </label>
          <a class="btn btn-primary btn-lg btn-block" href="#" @click="login">登录</a>
          <a class="login-link" href="#">忘记密码？</a>
        </form>
      </validator>
    </div>
    <div class="loading" v-if="loading" style="background-image: url(../assets/img/bg.jpg)">
      <scale-loader class="loading-center" color="white" height="60px" width="7px"></scale-loader>
    </div>
  </div>
</template>
<style>
  .login-screen {
    padding: 0;
    background: none;
  }

  .login-screen .login-screen-header {
    margin-top: 128px;
    color: #fff;
    text-align: center;
    margin-bottom: 32px;
  }

  .login-form {
    width: 320px;
    margin: 32px auto;
  }

  .login-form::before {
    content: none;
  }

  .notice {
    font-size: 13px;
    color: #e74c3c;
  }

  .loading {
    background-color: #1ABC9C;
    height: 100%;
    width: 100%;
    position: fixed;
    z-index: 99;
    top: 0px;
    left: 0px;
  }

  .loading-center {
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -30px;
    margin-left: -35px;
  }
</style>
