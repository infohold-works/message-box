<style>
body {
    background: #1ABC9C;
}
.login-screen {
    padding: 128px 384px
}
.login-form::before {
    content: none;
}
header h6 {
    text-align: center;
}
#notice{
    font-size:13px;
    color: #e74c3c;
}
</style>
<template>
    <div class="login-screen">
        <div class="login-form">
            <header>
                <h6>消息盒子</h6>
            </header>
            <div class="form-group">
                <input type="text" class="form-control login-field" value="" placeholder="用户名" v-model="userId">
                <label class="login-field-icon fui-user" for="login-name"></label>
            </div>

            <div class="form-group">
                <input type="password" class="form-control login-field" value="" placeholder="密码" v-model="passwd">
                <label class="login-field-icon fui-lock" for="login-pass"></label>
                <span  class="pull-right" id="notice">{{notice}}</span>
            </div>

            <a class="btn btn-primary btn-lg btn-block" href="#" @click="login">登录</a>
            <a class="login-link" href="#">忘记密码？</a>
        </div>
    </div>
</template>
<script>
    //连接本地接口8090
    var socket = require('socket.io-client')('http://192.168.1.114:8090');
    module.exports = {
        name: "Login",

        data: function() {
            return {
                notice:''
            }
        },

        props: ['msg'],

        methods: {
            login : function(){
                var id=this.userId;
                var password=this.passwd;
                if(id==""||password==""){
                   this.notice='用户名或密码不能为空';
                }else {
                    var self = this;
                    socket.emit('login', {userId: id, password: password});
                    socket.on('login', function (obj) {
                        if (obj.data == 0) {
                            self.msg = true;
                        } else {
                            self.notice='用户名或密码错误';
                        }
                    });
                }
            }

        }
    }
</script>
