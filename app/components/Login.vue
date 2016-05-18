<script>
  import {
    toggleLoading,
    toggleLogin,
    setUser,
    setErrorMsg,
    updateUser,
    setSetting
  } from '../vuex/actions'
  var env_conf = require('../../config/env_development.json');
  var socket = require('socket.io-client')(env_conf.socketServerUrl, {'force new connection': true});
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
        isChecked: false,
        isOnline: false,
        loginForm: ''
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
        setUser,
        setErrorMsg,
        updateUser,
        setSetting
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
      });

      socket.on('checkOnline', function(obj) {
        self.isOnline = obj.isOnline;
      });

      storage.has('setting', function(error, hasKey) {
        if (error) throw error;

        if (!hasKey) {
          storage.set('setting', env_conf.setting, function(error) {
            if (error) throw error;
            self.setSetting(env_conf.setting)
          });
        } else {
          storage.get('setting', function(error, data) {
            self.setSetting(data)
          });
        }
      });
    },

    methods: {
      onSubmit: function (e) {
        // validate manually
        this.loginForm.$submitted = true;

        if (this.loginForm.$invalid) {
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
                  self.setUser(docs);
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
  <div class="col-md-5 col-sm-5">
    <div class="login-logo" style="background: url(assets/img/logo340x512.png) no-repeat center center;"></div>
  </div>
  <div class="col-md-7 col-sm-7">
    <div class="login-screen" style="background: url(assets/img/bg2.png) no-repeat center center;">
      <div class="alert alert-danger alert-dismissible error-msg" role="alert" v-if="errorMsg">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="setErrorMsg(false)"><span aria-hidden="true">&times;</span></button>
        <strong>系统提示：</strong> {{ errorMsg }}
      </div>
      <div class="login-form">
        <form v-form name="loginForm" @submit.prevent="onSubmit">
          <div class="form-group" :class="{'has-error': loginForm.$submitted && loginForm.username.$error.required}">
            <input type="text" class="form-control" placeholder="用户名"
            v-model="username" name="username" v-form-ctrl required>
            <label class="login-field-icon fui-user" for="login-name"></label>
            <span class="notice pull-right" v-if="loginForm.$submitted && loginForm.username.$error.required">请输入用户名！</span>
          </div>
          <div class="form-group" :class="{'has-error': loginForm.$submitted && loginForm.password.$error.required}">
            <input type="password" class="form-control" placeholder="密码"
            v-model="password" name="password" v-form-ctrl required maxlength="16">
            <label class="login-field-icon fui-lock" for="login-pass"></label>
            <span class="notice pull-right" v-if="loginForm.$submitted && loginForm.password.$error.required">请输入密码！</span>
            <span class="notice pull-right" v-if="loginForm.$submitted && loginForm.password.$error.maxlength">密码最大16位！</span>
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
          <a class="login-link" href="#">忘记密码？</a>
          <button type="submit" class="btn btn-embossed btn-primary btn-lg btn-block">
            登&emsp;&emsp;录
          </button>
        </form>
        <!-- <pre>{{ loginForm | json }}</pre> -->
      </div>
      <div class="loading" v-if="loading" style="background: url(assets/img/bg.jpg) no-repeat center center fixed; background-size: cover">
        <scale-loader class="loading-center" color="white" height="60px" width="7px"></scale-loader>
      </div>
    </div>
  </div>
</template>
<style>
  .login-style {
    margin: 128px auto;
  }

  .login-logo {
    background-size: cover;
    min-height: 512px;
    /*max-width: 340px;*/
    margin: 128px 0 0 128px;
    zoom: .5;
  }

  .login-screen {
    padding: 0;
    min-height: 360px;
    max-width: 450px;
  }

  .login-screen .login-screen-header {
    margin-top: 128px;
    color: #fff;
    text-align: center;
    margin-bottom: 32px;
  }

  .login-form {
    width: 320px;
    top: 40px;
    left: 72px;
  }

  .login-form::before {
    content: none;
  }

  .login-form .checkbox {
    font-size: 13px;
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
    position: relative;
    top: 10px;
    left: 6px;
    width: 320px;
    margin: 0px auto -20px;
    min-height: 48px;
    font-size: 13px;
    color: #e74c3c;
  }
</style>
