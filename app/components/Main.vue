<style>
    footer {
        background: none;
    }

    .dashboard-summaries {
        position: absolute;
        top: 60px;
        bottom: 0;
        left: 192px;
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
        left: 512px;
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
        padding: 8px 16px;
    }

    .summaries .summary:hover {
        background: #fafafa;
    }

    .summaries .summary .summary-title h6 {
        display: inline-block;
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #27AE60;
    }

    .summaries .summary .summary-time {
        margin: 3px 0;
        font-size: 14px;
        color: #666;
    }

    .summaries .summary .summary-desc {
        font-size: 14px;
        color: #666;
    }

    .summaries .summary.readed {
        opacity: .8;
    }

    .summaries .summary.readed .summary-title h6 {
        color: #666;
    }

    .dashboard-summaries-search {
        margin: 6px 20px;
        width: 280px;
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
</style>

<template>
    <dashboard-header :socket.sync="socket" :title="title" :user-name="userName"></dashboard-header>
    <div class="dashboard-summaries">
        <div class="form-group has-feedback dashboard-summaries-search pull-right">
            <input type="text" value="" placeholder="搜索" class="form-control input-sm" v-model="searchQuery" />
            <span class="form-control-feedback fui-search"></span>
        </div>
        <ul v-if="summaries.length > 0" class="summaries">
            <li :class="{ readed : summary.read, selected: summary.selected}" v-for="summary in summaries |
            filterBy searchQuery in 'title' 'desc'  " class="animated fadeIn summary" @click="messageDetail(summary.id)">
                <article>
                    <header class="summary-title">
                        <h6 v-if="summary.title.length > 10">{{ summary.title.substring(0,10) }} ...</h6>
                        <h6 v-else>{{ summary.title }}</h6>
                        <time class="summary-time pull-right">{{ summary.sendtime.substr(0,10) }}</time>
                    </header>
                    <section class="summary-desc" v-if="summary.desc.length > 24">
                        {{ summary.desc.substr(0,64) }} ...
                    </section>
                    <section class="summary-desc" v-else>
                        {{ summary.desc }}
                    </section>
                </article>
            </li>
        </ul>
        <!-- vue.js 调试日志 -->
        <!-- <div>
            <p>当前路径: {{$route.path}}</p>
            <p>当前路由参数: {{$route.params | json}}</p>
        </div>
        <pre>
            {{ $data.summaries | json }}
        </pre> -->
        <div class="empty-placeholder" v-if="summaries.length == 0">暂时没有消息</div>
        <div class="empty-placeholder" v-if="refreshing">
            <pulse-loader></pulse-loader>
            <br/>
            <br/>
            <br/>
            <br/>
            <p>获取消息 ...</p>
        </div>
    </div>
    <div class="dashboard-message-detail">
        <div class="manage-message" v-if="mescontent">
            <button v-if="!markedread" @click="markRead(id)" type="button" class="btn btn-xs btn-primary btn-marked">
                <i class="fa fa-fw fa-check"></i> 标记为已读
            </button>
            <button v-if="markedread" @click="markUnread(id)" type="button" class="btn btn-xs btn-primary btn-marked">
                <i class="fa fa-fw fa-history"></i> 标记为未读
            </button>
        </div>
        <message-detail :mestitle="mestitle" :sendtime="sendtime" :author="author" :mescontent="mescontent" v-if="mescontent"></message-detail>
        <div class="empty-placeholder" v-if="!mescontent">没有选择消息</div>
    </div>
</template>

<script>
    // PulseLoader插件
    var PulseLoader = require('vue-spinner/src/PulseLoader.vue');
    // Child Component
    var Header = require('./Header.vue');
    var Message = require('./Message.vue');
    // 连接mongodb
    var env_conf = require('../../config/env_development.json');
    var connect = require('../services/mongodb-server/server').connect(env_conf.test.url, env_conf.test.options);
    // Electron API
    var remote = require('electron').remote;
    var ipcRenderer = require('electron').ipcRenderer;
    var notifier = remote.getGlobal('notifier');
    // Markdown Parser
    var marked = require('marked');


    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false
    });

    module.exports = {
        name: 'Main',
        props: [
            'userName',
            'isLogin',
            'socket'
        ],
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
                typeid: '',
                id: '',
                mestitle: '',
                mescontent: '',
                author: '',
                sendtime: '',
            }
        },

        ready: function() {
            var socket = this.socket;
            var self = this;
            // listen to news event raised by the server
            socket.on('public message', function(data) {
                self.newMessage(data);
            });

            // listen to news event raised by the server
            socket.on('private message', function(data) {
                self.newMessage(data);
            });
            this.searchAllSummaries();
        },

        methods: {
            searchAllSummaries() {
                var typeid = env_conf.typeid;
                this.getSummaries(typeid,[true,false]);
                this.mescontent = false;
            },
            markRead(id) {
                var self = this;
                // 传参赋值
                this.markedread = true;
                // read样式绑定
                for (var i in this.summaries) {
                    if (this.summaries[i].id == id) {
                        // this.summaries.$set(i,{read:true});        // 视图更新
                        this.summaries[i].read = true; // 视图不变
                        this.$dispatch('markRead', this.summaries[i].typeid);
                    }
                }
                connect(function(db) {
                    var userCollention = db.collection('mb_user');
                    var summaryCollection = db.collection('mb_summary');
                    var username = self.userName;
                    userCollention.find({
                        username: username
                    }).toArray(function(err, docs) {
                        summaryCollection.update({
                            userid: docs[0].userid,
                            "message.id": id
                        }, {
                            $set: {
                                "message.$.read": true
                            }
                        });
                    });
                })

            },
            markUnread(id) {
                var self = this;
                this.markedread = false;
                for (var i in this.summaries) {
                    if (this.summaries[i].id == id) {
                        // this.summaries.$set(i,{read:true});        // 视图更新
                        this.summaries[i].read = false; // 视图不变
                        this.$dispatch('markUnread', this.summaries[i].typeid);
                    }
                }
                connect(function(db) {
                    var userCollention = db.collection('mb_user');
                    var summaryCollection = db.collection('mb_summary');
                    var username = self.userName;
                    userCollention.find({
                        username: username
                    }).toArray(function(err, docs) {
                        summaryCollection.update({
                            userid: docs[0].userid,
                            "message.id": id
                        }, {
                            $set: {
                                "message.$.read": false
                            }
                        });
                    });
                })
            },
            messageDetail(id) {
                var self = this;
                var messagesId = id - 1;
                for (var i in this.summaries) {
                    if (this.summaries[i].id == id) {
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
                    var collection = db.collection('mb_message');
                    collection.find({}).toArray(function(err, docs) {
                        var messages = docs;
                        self.typeid = messages[messagesId].typeid;
                        self.id = messages[messagesId].id;
                        self.mestitle = messages[messagesId].title;
                        self.mescontent = marked(messages[messagesId].content);
                        self.author = messages[messagesId].author;
                        self.sendtime = messages[messagesId].sendtime;
                    });
                });
            },
            newMessage(data) {
                console.log('new message' + data);
                this.searchAllSummaries();
                ipcRenderer.send('update-icon', 'newMessage');
                this.$dispatch('newMessage', data.typeid);
                notifier.notify({
                    'title': "您有新的消息：" + data.title,
                    'message': data.desc,
                    'sound': true
                }, function(error, response) {
                    console.log(error);
                    console.log(response);
                });
            },
            getSummaries(typeid,readStat) {
                var self = this;
                var username = this.userName;
                connect(function(db) {
                    var userCollention = db.collection('mb_user');
                    var summaryCollection = db.collection('mb_summary');
                    userCollention.find({
                        username: username
                    }).toArray(function(err, docs) {
                        var cursor = summaryCollection.aggregate([{
                                $match: {
                                    userid: docs[0].userid,
                                    typeid: {
                                        $in: typeid
                                    }
                                }
                            }, {
                                $unwind: "$message"
                            }, {
                                $project: {
                                    _id: 0,
                                    userid: 1,
                                    typeid: 1,
                                    id: "$message.id",
                                    title: "$message.title",
                                    desc: "$message.desc",
                                    sendtime: "$message.sendtime",
                                    read: "$message.read"
                                }
                            }, {
                                $match: {
                                    read: {
                                        $in: readStat
                                    }
                                }
                            }, {
                                $sort: {
                                    sendtime: -1
                                }
                            }
                            // { $out: "mb_temp" }     // 输出到数据库
                        ], {
                            cursor: {
                                batchSize: 1
                            }
                        });
                        cursor.toArray(function(err, result) {
                            self.summaries = result;
                        });
                    });
                });
            }
        },

        events: {
            'summaries-searchAll': 'searchAllSummaries',
            'summaries-searchRead': function() {
                var typeid = env_conf.typeid;
                this.getSummaries(typeid,[true]);
                this.mescontent = false;
            },
            'summaries-searchUnread': function() {
                var typeid = env_conf.typeid;
                this.getSummaries(typeid,[false]);
                this.mescontent = false;
            },
            'summaries-searchType': function(id) {
                var typeid = [id];
                this.getSummaries(typeid,[true,false]);
                this.mescontent = false;
            },
            'exit': function() {
                this.isLogin = false;
            }
        },

        components: {
            PulseLoader,
            'dashboard-header': Header,
            'message-detail': Message
        }
    }
</script>
