<script>
    import {
      toggleLogin
    } from '../vuex/actions'
    // 连接mongodb
    var env_conf = require('../../config/env_development.json');
    var connect = require('../db').connect(env_conf.db.url, env_conf.db.options);
    var ipcRenderer = require('electron').ipcRenderer;
    // ipcRenderer.on('asynchronous-reply', function(event, arg) {
    //     console.log(arg); // prints "pong"
    // });
    // ipcRenderer.send('asynchronous-message', 'ping');
    module.exports = {
        name: 'Header',

        props: ['title'],

        vuex: {
            getters: {
                socket: ({ global }) => global.socket,
                userName: ({ login }) => login.userName
            },
            actions: {
              toggleLogin
            }
        },

        methods: {
            setting() {
                this.$dispatch('setting');
            },
            logout() {
                var username = this.userName;
                //连接数据库
                connect(function(db) {
                    //关联用户名表
                    var collection = db.collection('mb_user');
                    collection.update({
                        username: username
                    }, {
                        $set: {
                            online_stat: false,
                            socketID: ''
                        }
                    });
                })
                socket.emit('logout', {
                    username: username
                });
                this.toggleLogin();
            },
            exit() {
                ipcRenderer.send('exit', 'exit');
            }
        }
    }
</script>
<template>
    <h4>{{ title }}</h4>
    <div class="btn-group pull-right">
        <section class="dropdown-toggle" data-toggle="dropdown">
            欢迎您,{{ userName }}<span class="caret"></span>
        </section>
        <ul class="dropdown-menu" role="menu">
            <li><a href="#" @click="setting">设&emsp;&emsp;置</a></li>
            <li><a href="#">关于我们</a></li>
            <li class="divider"></li>
            <!-- <li><a href="#" @click="logout">登&emsp;&emsp;出</a></li> -->
            <li><a href="#" @click="exit">退&emsp;&emsp;出</a></li>
        </ul>
    </div>
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
