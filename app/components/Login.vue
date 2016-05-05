<script>
    var env_conf = require('../../config/env_development.json');
    var socket = require('socket.io-client')(env_conf.socketServerUrl);
    var moment = require('moment');
    var connect = require('../db').connect(env_conf.db.url, env_conf.db.options);
    var ScaleLoader = require('vue-spinner/src/ScaleLoader.vue');
    var storage = require('electron-json-storage');
    import {
      toggleLoading,
      toggleLogin,
      setUserName
    } from '../vuex/actions'
    // var ipcRenderer = require('electron').ipcRenderer;
    // ipcRenderer.on('asynchronous-reply', function(event, arg) {
    //     console.log(arg); // prints "pong"
    // });
    // ipcRenderer.send('asynchronous-message', 'ping');
    module.exports = {
        name: "Login",

        data: function() {
            return {
                noticeName: '',
                noticePswd: '',
                errorName: false,
                loginName: true,
                errorPswd: false,
                loginPswd: true,
                timeOut: true,
                noticeError: '',
                loading: false,
                password: '',
                isChecked: false,
                userName: ''
            }
        },

        props: [
            'socket'
        ],

        vuex: {
            getters: {
                loading: ({ login }) => login.loading
            },
            actions: {
                toggleLoading,
                toggleLogin,
                setUserName
            }
        },

        ready: function() {
            var self = this;
            this.socket = socket;
            storage.get('login-user', function(error, data) {
                if (error) throw error;
                self.userName = data.username;
                self.password = data.password;
                self.isChecked = data.isChecked;
            });
        },

        methods: {
            close: function() {
                this.timeOut = true;
            },
            login: function() {
                //清空提示和恢复输入栏状态
                this.errorName = false;
                this.loginName = true;
                this.errorPswd = false;
                this.loginPswd = true;
                this.noticeName = '';
                this.noticePswd = '';
                //获取用户名和密码
                var username = this.userName;
                var password = this.password;
                //判断用户名和密码是否为空
                if (username == "") {
                    this.noticeName = '用户名不能为空!';
                    this.errorName = true;
                    this.loginName = false;
                    if (password == "") {
                        this.noticePswd = '密码不能为空!';
                        this.errorPswd = true;
                        this.loginPswd = false;
                    }
                } else if (password == "") {
                    this.errorPswd = true;
                    this.loginPswd = false;
                    this.noticePswd = '密码不能为空!';
                } else {
                    var self = this;
                    self.loading = true;
                    connect(function(db) {
                        // Get the documents collection
                        var collection = db.collection('mb_user');
                        // Find some documents
                        collection.find({
                            username: username
                        }).toArray(function(err, data) {
                            if (data.length > 0) { //如果有此username
                                if (!data[0].online_stat) { //判断此username是否在线
                                    var pwd = data[0].password;
                                    if (password == pwd) { //密码正确
                                        //验证服务端是否启动
                                        var isOnlineStat = false;
                                        socket.emit('serverOnlineStat', {
                                            isOnlineStat: "isTrue"
                                        });

                                        socket.on('serverOnlineStat', function(obj) {
                                            isOnlineStat = obj.isOnlineStat;
                                        });
                                        setTimeout(function() {
                                            if (isOnlineStat) {
                                                if (!self.isChecked) password = "";
                                                self.toggleLogin()
                                                self.updateOnlineStat(username); //更改在线状态
                                                self.updateLastLoginTime(username); //更新上一次登录时间
                                                self.updateLoginTime(username, self.nowTime()); //添加当前时间
                                                socket.emit('login', {
                                                    username: username
                                                });
                                                self.setUserName(username);
                                                storage.set('login-user', {
                                                    username: username,
                                                    password: password,
                                                    isChecked: self.isChecked
                                                }, function(error) {
                                                    if (error) throw error;
                                                });
                                            } else {
                                                self.loading = false;
                                                self.timeOut = false;
                                                self.noticeError = '登录超时！';
                                            }
                                        }, 1000 * 3 + Math.random() * 1000);
                                    } else {
                                        self.errorPswd = true;
                                        self.loginPswd = false;
                                        self.loading = false;
                                        self.noticePswd = '密码错误!';
                                    }
                                } else {
                                    self.loading = false;
                                    self.timeOut = false;
                                    self.noticeError = '此用户已在线！';
                                }
                            } else { //如果没有此username
                                self.errorName = true;
                                self.loginName = false;
                                self.loading = false;
                                self.noticeName = '用户名不存在!';
                            }
                        });
                    });

                }
            },
            nowTime: function() { //生成当前时间
                return moment().format('YYYY-MM-DD HH:mm:ss');
            },
            updateLoginTime: function(username, nowtime) { //更新当前登录时间
                connect(function(db) {
                    var collection = db.collection('mb_user');
                    collection.update({
                        username: username
                    }, {
                        $set: {
                            login_time: nowtime
                        }
                    });
                });
            },
            updateOnlineStat: function(username) { //更改登录状态
                connect(function(db) {
                    var collection = db.collection('mb_user');
                    collection.update({
                        username: username
                    }, {
                        $set: {
                            online_stat: true
                        }
                    });
                });
            },
            updateLastLoginTime: function(username) { //更改上一次登录时间
                connect(function(db) {
                    var collection = db.collection('mb_user');
                    collection.find({
                        username: username
                    }).toArray(function(err, data) {
                        collection.update({
                            username: username
                        }, {
                            $set: {
                                last_login_time: data[0].login_time
                            }
                        });
                    });
                });
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
        <div class="alert alert-warning time-out" role="alert" :class="{'hidden':timeOut}">
            <a class="glyphicon glyphicon-remove-sign pull-right" href="#" @click="close"></a>
            <span>{{noticeError}}</span>
        </div>
        <div class="login-form">
            <div class="form-group" :class="{'has-error': errorName}">
                <input type="text" class="form-control" :class="{'login-field': loginName}" value="" placeholder="用户名" v-model="userName">
                <label class="login-field-icon fui-user" for="login-name"></label>
                <span class="notice pull-right ">{{noticeName}}</span>
            </div>
            <div class="form-group" :class="{'has-error': errorPswd}">
                <input type="password" class="form-control" :class="{'login-field': loginPswd}" value="" placeholder="密码" v-model="password">
                <label class="login-field-icon fui-lock" for="login-pass"></label>
                <span class="notice pull-right" id="">{{noticePswd}}</span>
            </div>
            <label class="checkbox" for="checkbox">
                <input class="custom-checkbox" id="checkbox" data-toggle="checkbox" type="checkbox" @click="savePasswd" v-if="!isChecked">
                <input class="custom-checkbox" id="checkbox" checked="checked" data-toggle="checkbox" type="checkbox" @click="removePasswd" v-if="isChecked">
                <span class="icons">
            	    <span class="icon-unchecked"></span>
                <span class="icon-checked"></span>
                </span>
                保持登录状态
            </label>
            <a class="btn btn-primary btn-lg btn-block" href="#" @click="login">登录</a>
            <a class="login-link" href="#">忘记密码？</a>
        </div>
        <div class="loading" v-if="loading">
            <scale-loader class="loading-center" color="white" height="60px" width="7px"></scale-loader>
        </div>
    </div>
</template>
<style>
    body {
        background: #1ABC9C;
    }

    .login-screen {
        padding: 0;
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

    .time-out {
        width: 320px;
        height: 30px;
        margin: -28px auto;
        color: #e74c3c;
        line-height: 4px;
        font-size: 13px;
    }

    .glyphicon-remove-sign {
        margin-top: -7px;
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
