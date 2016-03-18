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
</style>
<template>
    <div class="login-screen">
        <header class="login-screen-header">
            <h5>消息盒子</h5>
        </header>
        <!-- <pre>
            {{ $data | json }}
        </pre> -->
        <div class="login-form">
            <div class="form-group" v-bind:class="{ 'has-error': errorA}">
                <input type="text" class="form-control" v-bind:class="{ 'login-field': loginA}" value="" placeholder="用户名" v-model="userName">
                <label class="login-field-icon fui-user" for="login-name"></label>
                <span class="notice pull-right ">{{noticeName}}</span>
            </div>

            <div class="form-group" v-bind:class="{'has-error':errorB}">
                <input type="password" class="form-control" v-bind:class="{ 'login-field': loginB}" value="" placeholder="密码" v-model="password">
                <label class="login-field-icon fui-lock" for="login-pass"></label>
                <span class="notice pull-right" id="">{{noticePswd}}</span>
            </div>

            <a class="btn btn-primary btn-lg btn-block" href="#" @click="login">登录</a>
            <a class="login-link" href="#">忘记密码？</a>
        </div>
    </div>
</template>
<script>
    //连接网络接口3000
    var env_conf = require('../../config/env_development.json');
    var socket = require('socket.io-client')(env_conf.socketServerUrl);
    module.exports = {
        name: "Login",
        data: function() {
            return {
                noticeName: '',
                noticePswd: '',
                password: '',
                errorA: false,
                loginA: true,
                errorB: false,
                loginB: true
            }
        },
        props: [
            'isLogin',
            'userName'
        ],
        methods: {
            test: function() {
                this.isLogin = true;
            },
            login: function() {
                //清空提示和恢复输入栏状态
                this.errorA = false;
                this.loginA = true;
                this.errorB = false;
                this.loginB = true;
                this.noticeName = '';
                this.noticePswd = '';
                //获取用户名和密码
                var username = this.userName;
                var password = this.password;
                //判断用户名和密码是否为空
                if (username == "") {
                    this.noticeName = '用户名不能为空';
                    this.errorA = true;
                    this.loginA = false;
                    if (password == "") {
                        this.noticePswd = '密码不能为空';
                        this.errorB = true;
                        this.loginB = false;
                    }
                } else if (password == "") {
                    this.errorB = true;
                    this.loginB = false;
                    this.noticePswd = '密码不能为空';
                } else {
                    var self = this;
                    socket.emit('login', {
                        username: username,
                        password: password
                    });
                    socket.on('login', function(obj) {
                        if (obj.data == 0) {
                            self.userName = username;
                            self.isLogin = true;
                        } else if (obj.data == 1) {
                            self.errorB = true;
                            self.loginB = false;
                            self.noticePswd = '密码错误';
                        } else if (obj.data == 2) {
                            self.errorA = true;
                            self.loginA = false;
                            self.noticeName = '用户名不存在';
                        }
                    });
                }
            }
        }
    }
</script>
