<script>
    import {
        toggleRouter
    } from '../vuex/actions'
    // 连接mongodb
    var env_conf = require('../../config/env_development.json');
    var connect = require('../db').connect(env_conf.db.url, env_conf.db.options);
    // var assert = require('assert');

    module.exports = {
        name: "Sidebar",

        data: function() {
            return {
                messageTypes: [],
                selected: 'selected'
            }
        },

        vuex: {
            getters: {
                userName: ({ login }) => login.userName,
                isAll: ({ sidebar }) => sidebar.router.isAll,
                isRead: ({ sidebar }) => sidebar.router.isRead,
                isUnRead: ({ sidebar }) => sidebar.router.isUnRead,
                isType: ({ sidebar }) => sidebar.router.isType
            },
            actions: {
                toggleRouter
            }
        },

        // // Anything within the ready function will run when the application loads
        ready: function() {
            // When the application loads, we want to call the method that initializes
            // some data
            // GET request
            // this.$http({
            //     url: 'http://localhost:3000/messageTypes',
            //     method: 'GET'
            // }).then(function(response) {
            //     // success callback
            //     this.$set('messageTypes', response.data);
            // }, function(response) {
            //     // error callback
            // });

            // 使用mongodb获取数据
            var self = this;
            connect(function(db) {
                // Get the documents collection
                var userCollection = db.collection('mb_user');
                var summaryCollection = db.collection('mb_summary');
                var username = self.userName;
                // Find some documents
                userCollection.find({
                    username: username
                }).toArray(function(err, docs) {
                    var msgTypes = env_conf.messageTypes;
                    var msgCount = [];
                    summaryCollection.find({
                        userid: docs[0].userid
                    }).sort({
                        "typeid": 1
                    }).toArray(function(err, doc) {
                        for (var i = 0; i < msgTypes.length; i++) {
                            self.messageTypes.push({
                                title: msgTypes[i],
                                count: doc[i].count,
                                id: i + 1,
                                selected: false
                            });
                        }
                    });
                });
                // collection.find({}).toArray(function(err, docs) {
                //     // assert.equal(err, null);
                //     // assert.equal(5, docs.length);
                //     // console.log("Sidebar found the following records");
                //     // console.dir(docs);
                //     self.messageTypes = docs;
                //     console.log(docs)
                // });
            });

            // 删除写法
            // this.$http({
            //     url: 'http://localhost:3000/messageTypes/8',
            //     method: 'DELETE'
            // }).then(function(response) {
            //     console.log('删除成功');
            // })
        },

        methods: {
            allMessages() {
                this.toggleRouter('isAll');
                this.$dispatch('searchAll');
                return this.$route.router.go({
                    path: '/',
                    replace: true
                })
            },
            readMessages() {
                this.toggleRouter('isRead');
                this.$dispatch('searchRead');
                return this.$route.router.go({
                    path: '/message/read'
                });
            },
            unreadMessages() {
                this.toggleRouter('isUnRead');
                this.$dispatch('searchUnread');
                return this.$route.router.go({
                    path: '/message/unread'
                });
            },
            typeMessages(messageType, length) {
                for (var i = 0; i < length; i++) {
                    i == messageType.id - 1 ? this.messageTypes[i].selected = true :
                        this.messageTypes[i].selected = false;
                }
                this.toggleRouter('isType');

                // // 根据id查询
                // this.$http({
                //     url: 'http://localhost:3000/messageTypes',
                //     data: {
                //         id: messageType.id
                //     },
                //     method: 'GET'
                // }).then(function(response) {
                // }, function(response) {
                //     // error callback
                // });

                this.$dispatch('searchType', messageType.id);

                return this.$route.router.go({
                    path: '/type/' + messageType.title
                });
            },
            //修改数据库count
            updateCount(typeid, username) {
                var self = this;
                connect(function(db) {
                    var userCollection = db.collection('mb_user');
                    var summaryCollection = db.collection('mb_summary');
                    userCollection.find({
                        username: username
                    }).toArray(function(err, docs) {
                        summaryCollection.update({
                            userid: docs[0].userid,
                            typeid: typeid
                        }, {
                            $set: {
                                count: self.messageTypes[typeid - 1].count
                            }
                        });
                    });
                });
            }

        },

        events: {
            'siderbar-markRead': function(typeid) {
                var self = this;
                var username = this.userName;
                console.log('-1');
                this.messageTypes[typeid - 1].count -= 1;
                this.updateCount(typeid, username);
            },
            'siderbar-markUnread': function(typeid) {
                var self = this;
                var username = this.userName;
                console.log('+1');
                this.messageTypes[typeid - 1].count += 1;
                this.updateCount(typeid, username);
            },
            'siderbar-newMessage': function(typeid) {
                this.messageTypes[typeid - 1].count += 1;
            }

        }
    }
</script>
<template>
    <!-- dashboard-sidebar -->
    <div class="dashboard-sidebar">
        <div class="dashboard-sidebar-header">
            <h4 class="dashboard-sidebar-header-text">消息盒子</h4>
        </div>
        <div class="sidebar-header">
            <h4 class="sidebar-header-text">消息</h4>
        </div>
        <ul class="dashboard-list">
            <li class="dashboard-list-item" @click="allMessages()" :class="[isAll ? selected : '']">
                <i class="fa fa-fw fa-list"></i> 所有消息
            </li>
            <li class="dashboard-list-item" @click="readMessages()" :class="[isRead ? selected : '']">
                <i class="fa fa-fw fa-check"></i> 已读消息
            </li>
            <li class="dashboard-list-item" @click="unreadMessages()" :class="[isUnRead ? selected : '']">
                <i class="fa fa-fw fa-history"></i> 未读消息
            </li>
        </ul>
        <div class="sidebar-header">
            <h4 class="sidebar-header-text">类型</h4>
        </div>
        <ul class="dashboard-list">
            <li @click="typeMessages(messageType,messageTypes.length)" v-for="messageType in messageTypes" class="dashboard-list-item" :class="[messageType.selected ? isType ? selected : '' : '']">
                <i class="fa fa-fw fa-paperclip"></i> {{ messageType.title }}
                <span class="type-count pull-right badge" v-if="messageType.count > 0">{{ messageType.count }}</span>
            </li>
            <!-- <pre>
                {{ $data | json }}
            </pre> -->
        </ul>
    </div>
    <!-- ./dashboard-sidebar -->
</template>
<style>
    .dashboard-sidebar {
        background: #2C3E50;
        overflow-y: auto;
        overflow-x: hidden;
        position: absolute;
        top: 60px;
        bottom: 0;
        left: 0;
        width: 192px;
    }

    .dashboard-sidebar .dashboard-sidebar-header {
        width: 192px;
        height: 60px;
        padding: 0 20px;
        background: #1ABC9C;
        text-align: left;
        position: fixed;
        top: 0;
        left: 0;
    }

    .dashboard-sidebar .dashboard-sidebar-header .dashboard-sidebar-header-text {
        color: #fff;
        font-size: 24px;
    }

    .dashboard-sidebar .sidebar-header {
        color: rgba(255, 255, 255, 0.3);
        font-size: 0.7rem;
        font-weight: bold;
        height: 42px;
        overflow: hidden;
        padding: 15px 20px;
        position: relative;
        text-transform: uppercase;
    }

    .dashboard-sidebar .sidebar-header .sidebar-header-text {
        display: inline-block;
        margin: 0;
        position: relative;
        top: -2px;
        font-size: 18px;
    }

    .dashboard-sidebar .dashboard-list {
        clear: both;
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    .dashboard-sidebar .dashboard-list .dashboard-list-item.selected {
        background: #1ABC9C;
        color: #fff;
    }

    .dashboard-sidebar .dashboard-list .dashboard-list-item.selected:hover {
        background: #1ABC9C;
        color: #fff;
    }

    .dashboard-sidebar .dashboard-list .dashboard-list-item:first-child,
    .dashboard-sidebar .dashboard-list .dashboard-list-item:only-child {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .dashboard-sidebar .dashboard-list .dashboard-list-item:hover {
        color: #1ABC9C;
    }

    .dashboard-sidebar .dashboard-list .dashboard-list-item {
        -webkit-transition: all 200ms linear;
        -moz-transition: all 200ms linear;
        transition: all 200ms linear;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.66);
        cursor: pointer;
        font-size: 1.6rem;
        height: 42px;
        line-height: 42px;
        padding: 0 20px;
    }

    .type-count {
        margin: 11px 0;
    }

    .badge {
        background-color: #e74c3c;
    }
</style>
