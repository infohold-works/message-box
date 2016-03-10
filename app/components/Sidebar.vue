<style>
    .dashboard-sidebar {
        background: #2C3E50;
        overflow-y: auto;
        overflow-x: hidden;
        position: absolute;
        top: 60px;
        bottom: 0;
        left: 0;
        width: 256px;
    }

    .dashboard-sidebar .sidebar-header {
        width: 256px;
        height: 60px;
        padding: 0 20px;
        background: #1ABC9C;
        text-align: left;
        position: fixed;
        top: 0;
        left: 0;
    }

    .dashboard-sidebar .sidebar-header h4 {
        color: #fff;
        font-size: 24px;
    }

    .dashboard-sidebar .dashboard-list {
        clear: both;
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    .dashboard-sidebar .dashboard-list .dashboard-list-item.selected {
        background: #34495E;
        color: #fff;
    }

    .dashboard-sidebar .dashboard-list .dashboard-list-item:first-child,
    .dashboard-sidebar .dashboard-list .dashboard-list-item:only-child {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .dashboard-sidebar .dashboard-list .dashboard-list-item:hover {
        background: #34495E;
        color: rgba(255, 255, 255, 0.9);
    }

    .dashboard-sidebar .dashboard-list .dashboard-list-item {
        -webkit-transition: all 200ms linear;
        -moz-transition: all 200ms linear;
        transition: all 200ms linear;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.66);
        cursor: pointer;
        font-size: 1.4rem;
        height: 42px;
        line-height: 42px;
        padding: 0 20px;
    }

    .type-count {
        margin: 11px 0;
    }
</style>

<template>
    <!-- dashboard-sidebar -->
    <div class="dashboard-sidebar">
        <div class="sidebar-header">
            <h4 class="sidebar-header-text">消息盒子</h4>
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
        <ul class="dashboard-list">
            <li @click="typeMessages(messageType,messageTypes.length)" v-for="messageType in messageTypes" class="dashboard-list-item" :class="[messageType.selected ? isType ? selected : '' : '']">
                <i class="fa fa-fw fa-rss"></i> {{ messageType.title }}
                <span class="type-count pull-right badge">{{ messageType.count }}</span>
            </li>
            <!-- <pre>
                {{ $data | json }}
            </pre> -->
        </ul>
    </div>
    <!-- ./dashboard-sidebar -->
</template>

<script>
    // 连接mongodb
    var conf = require('../services/mongodb-server/database.json');
    var connect = require('../services/mongodb-server/server').connect(conf.test.url, conf.test.options);
    var assert = require('assert');

    module.exports = {
        name: "Sidebar",

        props: ['typeid', 'markread'],

        data: function() {
            return {
                messageTypes: [],
                selected: 'selected',
                isAll: false,
                isRead: false,
                isUnRead: false,
                isType: false
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
                // 获得db的引用，如果没有建立连接池，则建立，否则使用连接池的连接
                // Get the documents collection
                var collection = db.collection('messageTypes');
                // Find some documents
                collection.find({}).toArray(function(err, docs) {
                    // assert.equal(err, null);
                    // assert.equal(5, docs.length);
                    // console.log("Sidebar found the following records");
                    // console.dir(docs);
                    self.messageTypes = docs;
                });
            });

            // this.$http({
            //     url: 'http://localhost:3000/messageTypes?id=6',
            //     data: {
            //         title: ''
            //     },
            //     method: 'POST'
            // }).then(function(response) {
            //     console.log('success');
            // }, function(response) {
            // });

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
                this.$set('isAll', true);
                this.$set('isRead', false);
                this.$set('isUnRead', false);
                this.$set('isType', false);
                return this.$route.router.go({
                    path: '/',
                    replace: true
                })
            },
            readMessages() {
                this.$set('isAll', false);
                this.$set('isRead', true);
                this.$set('isUnRead', false);
                this.$set('isType', false);
                return this.$route.router.go({
                    path: '/message/read'
                });
            },
            unreadMessages() {
                this.$set('isAll', false);
                this.$set('isRead', false);
                this.$set('isUnRead', true);
                this.$set('isType', false);
                return this.$route.router.go({
                    path: '/message/unread'
                });
            },
            typeMessages(messageType, length) {
                for (var i = 0; i < length; i++) {
                    i == messageType.id - 1 ? this.messageTypes[i].selected = true :
                        this.messageTypes[i].selected = false;
                }
                this.$set('isAll', false);
                this.$set('isRead', false);
                this.$set('isUnRead', false);
                this.$set('isType', true);

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

                return this.$route.router.go({
                    path: '/type/' + messageType.title
                });
            }
        },

        events: {
            'siderbar-markRead': function() {
                console.log('typeid:' + this.typeid);
                this.messageTypes[this.typeid - 1].count -= 1;
            },
            'siderbar-markUnread': function() {
                console.log('+1');
                this.messageTypes[this.typeid - 1].count += 1;
            }
        }
    }
</script>
