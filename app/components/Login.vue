<script>
  import {
    toggleLoading,
    toggleLogin,
    setUserName,
    setErrorMsg,
    updateUser
  } from '../vuex/actions'
  var env_conf = require('../../config/env_development.json');
  var socket = require('socket.io-client')(env_conf.socketServerUrl);
  var ScaleLoader = require('vue-spinner/src/ScaleLoader.vue');
  var storage = require('electron-json-storage');
  // import User from '../vuex/models/userModel'
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
        isChecked: false,
        isOnline: false
      }
    },

    props: [
      'socket'
    ],

    vuex: {
      getters: {
        loading: ({login}) => login.loading,
        errorMsg: ({login}) => login.errorMsg,
        User: ({global}) => global.User
      },
      actions: {
        toggleLoading,
        toggleLogin,
        setUserName,
        setErrorMsg,
        updateUser
      }
    },

    ready: function() {
      var self = this;
      this.socket = socket;

      storage.get('login-user', function(error, data) {
        if (error) throw error;
        self.username = data.username;
        self.password = data.password;
        self.isChecked = data.isChecked;
        self.setUserName(data.username);
      });

      socket.on('checkOnline', function(obj) {
        self.isOnline = obj.isOnline;
      });
    },

    methods: {
      onSubmit: function (e) {
        // validate manually
        this.$validate(true);

        if (this.$loginValidation.invalid) {
          e.preventDefault();
        } else {
          this.login();
        }
      },
      login: function() {
        var self = this

        this.toggleLoading();

        socket.emit('checkOnline', {
          isOnline: "detect"
        });

        setTimeout(function() {
          if (self.isOnline) {
            self.User.findOne({username: self.username}, function (err, docs) {
              if (docs !== null) {
                if (self.password !== docs.password) {
                  self.toggleLoading();
                  self.setErrorMsg('密码不正确！')
                } else {
                  self.updateUser(self.User, self.username);
                  storage.set('login-user', {
                    username: self.username,
                    password: self.password,
                    isChecked: self.isChecked
                  }, function(error) {
                    if (error) throw error;
                  });
                  socket.emit('login', {
                    username: self.username
                  });
                  self.setUserName(self.username);
                  self.toggleLogin();
                }
              } else {
                self.toggleLoading();
                self.setErrorMsg('用户名不存在！')
              }
            })
          } else {
            self.toggleLoading();
            self.setErrorMsg('系统繁忙，请稍后再试！')
          }
        }, 1000 * 3 + Math.random() * 1000);
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
  <!-- <div class="login-icon" style="background: url(assets/img/logo340x512.png) no-repeat center center;"></div> -->
  <!-- <div class="login-screen" style="background: url(assets/img/bg2.png) no-repeat center center;"> -->
  <div class="login-screen">
    <header class="login-screen-header">
      <h5>消息盒子</h5>
    </header>
    <!-- <pre>
      {{ $data | json }}
    </pre> -->
    <div class="alert alert-danger alert-dismissible error-msg" role="alert" v-if="errorMsg">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      <strong>系统提示：</strong> {{ errorMsg }}
    </div>
    <div class="login-form">
      <validator name="loginValidation">
        <form novalidate @submit="onSubmit">
          <div class="form-group" :class="{'has-error': $loginValidation.username.required}">
            <input type="text" class="form-control" placeholder="用户名"
            v-model="username" initial="off" v-validate:username="['required']">
            <label class="login-field-icon fui-user" for="login-name"></label>
            <span class="notice pull-right" v-if="$loginValidation.username.required">请输入用户名！</span>
          </div>
          <div class="form-group" :class="{'has-error': $loginValidation.password.required}">
            <input type="password" class="form-control" placeholder="密码"
            v-model="password" initial="off" v-validate:password="{ required: true, maxlength: 16 }">
            <label class="login-field-icon fui-lock" for="login-pass"></label>
            <span class="notice pull-right" v-if="$loginValidation.password.required">请输入密码！</span>
            <span class="notice pull-right" v-if="$loginValidation.password.maxlength">密码最大16位！</span>
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
          <button type="submit" class="btn btn-embossed btn-primary btn-lg btn-block">
            登&emsp;&emsp;录
          </button>
          <a class="login-link" href="#">忘记密码？</a>
        </form>
      </validator>
    </div>
    <div class="loading" v-if="loading" style="background: url(assets/img/bg.jpg) no-repeat center center fixed; background-size: cover">
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

  .error-msg {
    width: 320px;
    margin: 32px auto -20px;
    min-height: 48px;
    font-size: 13px;
    color: #e74c3c;
  }
</style>
