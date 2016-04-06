<style>
    footer {
        background: none;
    }

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
    <div class="dashboard-header">
        <h4>{{ title }}</h4>
        <!-- <div class="form-group has-feedback dashboard-header-search pull-right">
            <input type="text" value="" placeholder="搜索" class="form-control" v-model="searchQuery" />
            <span class="form-control-feedback fui-search"></span>
        </div> -->
        <div class="btn-group pull-right">
            <section class="dropdown-toggle" data-toggle="dropdown">
                欢迎您,{{ userName }}<span class="caret"></span>
            </section>
            <ul class="dropdown-menu" role="menu">
                <li><a href="#">设&emsp;&emsp;置</a></li>
                <li><a href="#">关于我们</a></li>
                <li class="divider"></li>
                <li><a href="#" @click="exit">登&emsp;&emsp;出</a></li>
            </ul>
        </div>
    </div>
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
    var PulseLoader = require('vue-spinner/src/PulseLoader.vue'); // PulseLoader插件
    var Message = require('./Message.vue');
    // 连接mongodb
    var env_conf = require('../../config/env_development.json');
    var connect = require('../services/mongodb-server/server').connect(env_conf.test.url, env_conf.test.options);

    var notifier = require('electron').remote.getGlobal('notifier');
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
            exit() {
                var socket = this.socket;
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
                socket.emit('exit', {
                    username: username
                });
                this.isLogin = false;
            },
            newMessage(data) {
                console.log('private message' + data);
                this.searchAllSummaries();
                this.$dispatch('newMsg', data.typeid);
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
            }
        },

        components: {
            PulseLoader,
            'message-detail': Message
        }
    }
</script>
