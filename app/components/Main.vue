<style>
    .dashboard .dashboard-header {
        background: #fff;
        border-bottom: 1px solid rgba(55, 53, 112, 0.1);
        color: #fff;
        height: 60px;
        line-height: 60px;
        position: absolute;
        left: 256px;
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

    .dashboard-summaries {
        position: absolute;
        top: 60px;
        bottom: 0;
        left: 256px;
        background: #fafafa;
        overflow-y: auto;
        width: 320px;
        border-right: 1px solid rgba(55, 53, 112, 0.08);
    }

    .dashboard-message-detail {
        background: #fff;
        color: #2C3E50;
        position: absolute;
        top: 60px;
        left: 576px;
        right: 0;
        bottom: 0;
        min-width: 448px;
    }

    .dashboard-message-detail .empty-placeholder {
        -webkit-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        -o-transform: translateY(-50%);
        transform: translateY(-50%);
        color: #658399;
        font-weight: bold;
        pointer-events: none;
        position: absolute;
        top: 50%;
        left: 0;
        text-align: center;
        width: 100%;
    }

    .dashboard-message-detail .manage-message {
        width: 100%;
        height: 48px;
        background: #fafafa;
        border-bottom: 1px solid rgba(55, 53, 112, 0.1);
        box-shadow: 0 1px 3px rgba(55, 53, 112, 0.08);
        position: absolute;
        z-index: 99;
    }

    .dashboard-message-detail .manage-message .btn-marked {
        margin: 10px;
    }

    .dashboard-message-detail .message-read {
        font-size: 1.4rem;
        line-height: 1.5;
        overflow-x: hidden;
        overflow-y: scroll;
        padding: 20px;
        position: absolute;
        top: 48px;
        left: 0;
        bottom: 0;
        right: 0;
        word-wrap: break-word;
    }

    .form-control-feedback {
        position: absolute;
        top: 2px;
        right: 2px;
        padding: 0 12px 0 0;
        margin-top: 1px;
        font-size: 17px;
        line-height: 36px;
        color: #b2bcc5;
        background-color: transparent;
        border-radius: 6px;
    }
    /* 消息列表 */

    .summaries {
        box-shadow: 1px 0 3px rgba(55, 53, 112, 0.08);
        list-style-type: none;
        margin: 48px 0 0;
        padding: 0;
        width: 100%;
    }

    .summaries .summary {
        background: #fff;
        background-clip: padding-box;
        border-bottom: 1px solid rgba(55, 53, 112, 0.1);
        cursor: pointer;
        display: block;
        margin: 0;
        padding: 5px 10px;
    }

    /*.summaries .summary:hover {
        opacity: .9;
        background: #34495E;
        color: #fff;
    }*/

    .summaries .summary h6 {
        font-size: 18px;
        font-weight: 600;
        color: #27AE60;
        margin: 4px 0;
    }

    .summaries .summary.readed {
        opacity: .6;
    }

    .summaries .summary.selected {
        background: #fafafa;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .dashboard-summaries .empty-placeholder {
        -webkit-transform: translateY(-50%);
        transform: translateY(-50%);
        color: #658399;
        font-weight: bold;
        pointer-events: none;
        position: absolute;
        top: 50%;
        left: 0;
        text-align: center;
        width: 100%;
    }

    .dashboard-summaries-search {
        margin: 6px 10px;
        width: 300px;
    }

    .description {
        font-size: 14px;
    }
</style>

<template>
    <div class="dashboard-header">
        <h4>{{ title }}</h4>
        <!-- <div class="form-group has-feedback dashboard-header-search pull-right">
            <input type="text" value="" placeholder="搜索" class="form-control" v-model="searchQuery" />
            <span class="form-control-feedback fui-search"></span>
        </div> -->
    </div>
    <div class="dashboard-summaries">
        <div class="form-group has-feedback dashboard-summaries-search pull-right">
            <input type="text" value="" placeholder="搜索" class="form-control input-sm" v-model="searchQuery" />
            <span class="form-control-feedback fui-search"></span>
        </div>
        <ul v-if="summaries.length > 0" class="summaries">
            <li :class="{ readed : summary.read, selected: summary.selected}" v-for="summary in summaries |
            filterBy searchQuery in 'title' 'desc'  " class="summary" @click="messageDetail(summary.id)">
                <div>
                    <h6>{{ summary.title }}</h6>
                    <div class="description">
                        {{ summary.desc }}
                    </div>
                </div>
            </li>
        </ul>
        <!-- vue.js 调试日志 -->
        <!-- <div>
            <p>当前路径: {{$route.path}}</p>
            <p>当前路由参数: {{$route.params | json}}</p>
        </div>
        <pre>
            {{ $data | json }}
        </pre> -->
        <div class="empty-placeholder" v-if="summaries.length == 0">暂时没有消息</div>
        <div class="empty-placeholder" v-if="refreshing">
            <pulse-loader></pulse-loader>
            <br/>
            <br/>
            <br/>
            <br/>
            <p>获取信息消息 ...</p>
        </div>
    </div>
    <div class="dashboard-message-detail">
        <div class="manage-message" v-if="mescontent">
            <button v-if="!markedread" v-on:click="markRead(id)" type="button" class="btn btn-xs btn-primary btn-marked">
                <i class="fa fa-fw fa-check"></i> 标记为已读
            </button>
            <button v-if="markedread" v-on:click="markUnread(id)" type="button" class="btn btn-xs btn-primary btn-marked">
                <i class="fa fa-fw fa-history"></i> 标记为未读
            </button>
        </div>
        <message-detail :mestitle="mestitle" :sendtime="sendtime" :author="author" :mescontent="mescontent" v-if="mescontent"></message-detail>
        <div class="empty-placeholder" v-if="!mescontent">没有选择消息</div>
    </div>
</template>

<script>
    var PulseLoader = require('vue-spinner/src/PulseLoader.vue'); // PulseLoader插件
    var Message = require('./Message.vue');
    // 连接mongodb
    var env_conf = require('../../config/env_development.json');
    var connect = require('../services/mongodb-server/server').connect(env_conf.test.url, env_conf.test.options);
    var assert = require('assert');

    module.exports = {
        name: 'Main',

        route: {
            data({
                to
            }) {
                if (to.params.type === "type") {
                    this.title = to.params.name
                    this.state = 'type'
                } else if (to.params.type === "message" && to.params.name === "read") {
                    this.title = "已读消息"
                    this.state = 'read'
                } else if (to.params.type === "message" && to.params.name === "unread") {
                    this.title = "未读消息"
                    this.state = "unread"
                } else {
                    this.title = "所有消息"
                    this.state = "all"
                }
            },
            activate: function(transition) {
                return new Promise((resolve) => {
                    console.log('hook-example activated!')
                    resolve()
                })
            },
            deactivate: function(transition) {
                console.log('hook-example deactivated!')
                transition.next()
            },
            canReuse: function(transition) {
                return true;
            }
        },

        data: function() {
            return {
                title: "所有消息",
                refreshing: false,
                state: '',
                summaries: [],
                searchQuery: '',
                markedread: '',
                selected: '',
                id: '',
                mestitle: '',
                mescontent: '',
                author: '',
                sendtime: '',
            }
        },

        ready: function() {
            this.searchAllSummaries();
        },

        methods: {
            searchAllSummaries() {
                var self = this;
                connect(function(db) {
                    var collection = db.collection('mb_summaries');
                    collection.find({}).sort({
                        "sendtime": -1
                    }).toArray(function(err, docs) {
                        self.summaries = docs;
                    });
                });
            },
            markRead(id) {
                // 传参赋值
                this.markedread = true;
                // read样式绑定
                for (var i in this.summaries) {
                    if(this.summaries[i].id == id) {
                        // this.summaries.$set(i,{read:true});        // 视图更新
                        this.summaries[i].read = true;                // 视图不变
                        this.$dispatch('markRead',this.summaries[i].typeid);
                    }
                }
                connect(function(db) {
                    var collection = db.collection('mb_summaries');
                    collection.update({
                        id: id
                    }, {
                        $set: {
                            read: true
                        }
                    });
                })

            },
            markUnread(id) {
                this.markedread = false;
                for (var i in this.summaries) {
                    if(this.summaries[i].id == id) {
                        // this.summaries.$set(i,{read:true});        // 视图更新
                        this.summaries[i].read = false;               // 视图不变
                        this.$dispatch('markUnread',this.summaries[i].typeid);
                    }
                }
                connect(function(db) {
                    var collection = db.collection('mb_summaries');
                    collection.update({
                        id: id
                    }, {
                        $set: {
                            read: false
                        }
                    });
                })
            },
            messageDetail(id) {
                var self = this;
                var messagesId = id - 1;
                for (var i in this.summaries) {
                    if(this.summaries[i].id == id) {
                        // this.summaries[i].selected = '';
                        if (this.summaries[i].read) {
                            this.markedread = true;
                        } else {
                            this.markRead(id);
                        }
                        // this.summaries[i].selected = true;
                    }
                }
                connect(function(db) {
                    var collection = db.collection('mb_messages');
                    collection.find({}).toArray(function(err, docs) {
                        var messages = docs;
                        self.typeid = messages[messagesId].typeid;
                        self.id = messages[messagesId].id;
                        self.mestitle = messages[messagesId].title;
                        self.mescontent = messages[messagesId].content;
                        self.author = messages[messagesId].author;
                        self.sendtime = messages[messagesId].sendtime;
                    });
                });
            }
        },

        events: {
            'summaries-searchAll': 'searchAllSummaries',
            'summaries-searchRead': function() {
                var self = this;
                connect(function(db) {
                    var collection = db.collection('mb_summaries');
                    collection.find({
                        read: true
                    }).sort({
                        "sendtime": -1
                    }).toArray(function(err, docs) {
                        self.summaries = docs;
                    });
                });
            },
            'summaries-searchUnread': function() {
                var self = this;
                connect(function(db) {
                    var collection = db.collection('mb_summaries');
                    collection.find({
                        read: false
                    }).sort({
                        "sendtime": -1
                    }).toArray(function(err, docs) {
                        self.summaries = docs;
                    });
                });
            },
            'summaries-searchType': function(id) {
                var self = this;
                connect(function(db) {
                    var collection = db.collection('mb_summaries');
                    collection.find({
                        typeid: id
                    }).sort({
                        "sendtime": -1
                    }).toArray(function(err, docs) {
                        self.summaries = docs;
                    });
                });
            }
        },

        components: {
            PulseLoader,
            'message-detail': Message
        }
    }
</script>
