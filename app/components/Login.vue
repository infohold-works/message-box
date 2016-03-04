<template>
    <h1>数吉消息盒子<sup>V0.01</sup></h1>
    <div class="login">
        <div class="header">
            <div class="switch" id="switch">
                <a class="switch_btn_focus" id="switch_qlogin" href="javascript:void(0);" tabindex="7">登&nbsp&nbsp&nbsp&nbsp&nbsp	录</a>
                <a class="switch_btn" id="switch_login" href="javascript:void(0);" tabindex="8">快速注册</a>
                <div class="switch_bottom" id="switch_bottom"></div>
            </div>
        </div>
        <div class="web_qr_login" id="web_qr_login" style="display:block;height:235px;">
            <!-- 登录-->
            <div class="web_login" id="web_login">
                <div class="login-box">
                    <div class="login_form">
                        <form action="#" name="loginform" accept-charset="utf-8" id="login_form" class="loginForm" method="post">
                            <input type="hidden" name="did" value="0"/>
                            <input type="hidden" name="to" value="log"/>
                            <div class="uinArea" id="uinArea">
                                <label class="input-tips" for="u">账号:</label>
                                <div class="inputOuter" id="uArea">
                                    <input type="text" id="u" name="username" class="inputstyle"/>
                                </div>
                            </div>
                            <div class="pwdArea" id="pwdArea">
                                <label class="input-tips" for="p">密码:</label>
                                <div class="inputOuter" id="pArea">
                                    <input type="password" id="p" name="p" class="inputstyle"/>
                                </div>
                            </div>
                            <div style="padding-left:50px;margin-top:20px;">
                                <input type="button" value="登录" style="width:150px;" class="button_blue">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <!-- 登录结束-->
        <!-- 注册开始-->
        <div class="qlogin" id="qlogin" style="display:none;">
            <div class="web_login">
                <form name="form2" id="regUser" accept-charset="utf-8" action="javascript:void(0);" method="post">
                    <input type="hidden" name="to" value="reg">
                    <input type="hidden" name="did" value="0">
                    <ul id="reg_ul" class="reg_form" >

                        <li>
                            <label for="user" class="input-tips2">用户名:</label>
                            <div class="inputOuter2">
                                <input type="text" id="user" name="user" maxlength="16" class="inputstyle2" />
                            </div>
                        </li>
                        <li>
                            <label for="passwd" class="input-tips2">密码:</label>
                            <div class="inputOuter2">
                                <input type="password" id="passwd" name="passwd" maxlength="16" class="inputstyle2" />
                            </div>
                        </li>
                        <li>
                            <label for="passwds" class="input-tips2">确认密码:</label>
                            <div class="inputOuter2">
                                <input type="password" id="passwd2" name="passwd2" maxlength="16" class="inputstyle2" />
                            </div>
                        </li>
                        <li>
                            <label for="tel" class="input-tips2">手机:</label>
                            <div class="inputOuter2">
                                <input type="text" id="tel" name="tel" maxlength="11" class="inputstyle2" />
                            </div>
                        </li>
                        <li>
                            <div class="inputArea">
                                <input type="button" id="reg" class="button_blue"style="margin-top:10px;margin-left:85px;" value="同意并注册" />
                                <a href="#" class="zcxy" target="_blank">注册协议</a>
                            </div>
                        </li>

                    </ul>

                </form>
            </div>
        </div>

    </div>
</template>

<script>
    $(function(){

        $('#switch_qlogin').click(function(){
            $('#switch_login').removeClass('switch_btn_focus').addClass('switch_btn');
            $('#switch_qlogin').removeClass('switch_btn').addClass('switch_btn_focus');
            $('#switch_bottom').animate({left:'0',width:'70px'});
            $('#qlogin').css('display','none');
            $('#web_qr_login').css('display','block');

        });
        $('#switch_login').click(function(){
            $('#switch_login').removeClass('switch_btn').addClass('switch_btn_focus');
            $('#switch_qlogin').removeClass('switch_btn_focus').addClass('switch_btn');
            $('#switch_bottom').animate({left:'154px',width:'70px'});
            $('#qlogin').css('display','block');
            $('#web_qr_login').css('display','none');

        });

    })
</script>


<style>

        body{

            margin: 0;
          background-color: #98FB98;
        }
        ul{
            padding:0;
            margin:0;
        }
        ul li{
            list-style-type: none;
        }
        a{
            text-decoration: none;
        }
        a:hover{
            text-decoration: none;
            color:#f00;
        }

        .login{
            margin: 0 auto;
            margin-top: 50px;
            width: 370px;
            border-bottom: none;
            position: relative;
            background-color:#ffffff;
            border:0;
            padding:5px 0;
            background: #fff;
            box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, .3);
        }
        .header{
            height: 50px;
            border-bottom: 1px solid #e2e2e2;
            position: relative;
            font-family: "Microsoft Yahei";
        }
        .header .switch{
            height: 45px;
            position: absolute;
            left: 60px;
            bottom: 0;
            font-size: 16px;
        }
        .header .switch #switch_qlogin{
            margin-right: 85px;
        }
        .header .switch .switch_btn{
            color: #999;
            display: inline-block;
            height: 45px;
            line-height: 45px;
            outline: none;

        }
        .header .switch .switch_btn_focus{
            color: #333;
            display: inline-block;
            height: 45px;
            line-height: 45px;
            outline: none;
        }
        .header .switch .switch_btn:hover{
            color: #333;
            text-decoration:none;
        }
        .header .switch .switch_btn_focus:hover{
            text-decoration: none;
        }
        #switch_bottom{
            position: absolute;
            bottom:-1px;
            border-bottom: 2px solid #848484;
            width: 64px;
            left: 0px;
        }
        .web_login{
            width: 370px;
            position: relative;
            margin-top: 30px;
            padding-bottom: 20px;

        }
        .web_login .login_form{
            width: 272px;
            margin: 0 auto;
        }
        .web_login .reg_form {
            width: 300px;
            margin: 0 auto;
        }

        .web_login .input-tips{
            float: left;
            margin-top: 10px;
            width: 50px;
            height: 42px;
            font-size: 16px;
            line-height: 42px;
            font-family: "Microsoft Yahei";
        }
        .input-tips2{
            float: left;
            text-align: right;
            padding-right: 10px;
            width: 75px;
            height: 30px;
            font-size: 16px;
            margin-top: 10px;
            clear: both;
            line-height: 30px;
            font-family: "Microsoft Yahei";
        }
        .web_login .inputOuter{
            width: 200px;
            height: 42px;
            margin-top: 10px;
            float: left;
        }
        .inputOuter2{
            width: 200px;
            margin-top: 10px;
            float: left;
        }
        .web_login .inputstyle{
            width: 200px;
            height: 38px;
            padding-left: 5px;
            line-height: 30px;
            border: 1px solid #D7D7D7;
            background: #fff;
            color: #333;
            border-radius: 2px;
            font-family: Verdana, Tahoma, Arial;
            font-size: 16px;
        }
        .inputstyle2{
            width: 200px;
            height: 38px;
            padding-left: 5px;
            line-height: 30px;
            border:1px solid #D7D7D7;
            background: #fff;
            color: #333;
            border-radius: 2px;
            font-size: 16px;

        }
        .web_login input.inputstyle:focus{
            border:1px solid #198BD4;
            box-shadow:0 0 2px #198BD4;
        }
        .inputstyle2:focus{
            border:1px solid #198BD4;
            box-shadow: 0 0 2px #198BD4;
        }
        .web_login .uinArea{
            height: 55px;
            position: relative;
            z-index: 10;
        }
        .web_login .pwdArea{
            height: 55px;
            margin-bottom: 10px;
            position: relative;
            z-index: 3;
        }
        .web_qr_login{
            position: relative;
            overflow: hidden;
        }

        .button_blue{
            display: inline-block;
            float: left;
            height: 41px;
            border-radius: 4px;
            background: #2795dc;
            border:none;
            cursor: pointer;
            border-bottom: 3px solid #0078b3;
            color: #fff;
            font-size: 16px;
            padding-left: 0 10px;
            text-align: center;
            outline: none;
        }
        input.button_blue:hover{
            background: #0081c1;
            border-bottom: 3px solid #006698;
            color: #fff;
            text-decoration: none;
        }
        h1{
            margin:80px auto 50px auto;
            text-align:center;color:#fff;
            margin-left:-25px;
            font-size:35px;
            font-weight: bold;
            text-shadow: 0px 1px 1px #555;
        }

        .zcxy{
            text-decoration: underline;
            line-height: 58px;
            margin-left: 15px;
            color: #959ca8;
        }
        .web_login .reg_form {
            width: 300px;
            padding-left: 0;
            margin: 0 auto;
        }
        .reg_form li {
            height: 55px;
            margin: 0 auto;
        }
    </style>

