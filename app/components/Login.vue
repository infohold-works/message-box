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
</style>
<template>
    <div class="login-screen">
        <div class="login-form">
            <header>
                <h6>消息盒子</h6>
            </header>
            <div class="form-group">
                <input type="text" class="form-control login-field" value="" placeholder="用户名" id="login-name">
                <label class="login-field-icon fui-user" for="login-name"></label>
            </div>

            <div class="form-group">
                <input type="password" class="form-control login-field" value="" placeholder="密码" id="login-pass">
                <label class="login-field-icon fui-lock" for="login-pass"></label>
                <span id="care" style="float:right;font-size: 12px;color: red"></span>
            </div>

            <a class="btn btn-primary btn-lg btn-block" href="#" @click="login">登录</a>
            <a class="login-link" href="#">忘记密码？</a>
        </div>
    </div>
</template>
<script>
    //连接本地接口8090
    var socket = require('socket.io-client')('http://localhost:8090');
    module.exports = {
        name: "Login",

        props: ['msg'],

        methods: {
            login : function(){
                $('#care').html('');
                var id=$('#login-name').val().trim();
                var password=$('#login-pass').val().trim();
                if(id==""&&password==""){
                    $('#care').html('账号或密码不能为空');
                }else {
                    var self = this;
                    socket.emit('login', {userId: id, password: password});
                    socket.on('login', function (obj) {
                        if (obj.data == 0) {
//                             self.msg = true;
                            console.log("success");
                        } else {
                            $('#care').html('用户名或密码错误');
                            console.log("fail")
                        }
                    });
                }
            }
        }
    }
</script>
