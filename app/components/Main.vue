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

    .dashboard-header-search {
        margin: 9px 9px 0 0;
    }

    .dashboard-summaries {
        position: absolute;
        top: 60px;
        bottom: 0;
        left: 256px;
        background: #fafafa;
        overflow-y: auto;
        width: 320px;
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
        border-right: 1px solid rgba(55, 53, 112, 0.08);
        box-shadow: 1px 0 3px rgba(55, 53, 112, 0.08);
        list-style-type: none;
        margin: 0;
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
        padding: 10px 20px;
    }

    .summaries .summary h6 {
        font-size: 18px;
        font-weight: 600;
        color: #27AE60;
        margin: 4px 0;
    }

    .summaries .readed {
        opacity: .6;
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

    .description {
        font-size: 14px;
    }
</style>

<template>
    <div class="dashboard-header">
        <h4>{{ title }}</h4>
        <div class="form-group has-feedback dashboard-header-search pull-right">
            <input type="text" value="" placeholder="搜索" class="form-control" v-model="searchQuery" />
            <span class="form-control-feedback fui-search"></span>
        </div>
    </div>
    <div class="dashboard-summaries">
        <ul v-if="summaries.length > 0" class="summaries">
            <li :class="{ readed : summary.read }" v-for="summary in summaries |
            filterBy searchQuery in 'title' 'desc'" class="summary" @click="messageDetail(summary.id)">
                <h6>{{ summary.title }}</h6>
                <div class="description">
                    {{ summary.desc }}
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
    var PulseLoader = require('vue-spinner/src/PulseLoader.vue');    // PulseLoader插件
    var Message = require('./Message.vue');

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

        props: ['typeid','markread'],

        data: function() {
            return {
                title: "所有消息",
                id: '',
                mestitle: '',
                mescontent: '',
                author: '',
                sendtime: '',
                markedread: '',
                refreshing: false,
                state: '',
                summaries: []
            }
        },

        ready: function() {
            // When the application loads, we want to call the method that initializes
            // some data
            this.$http({
                url: 'http://localhost:3000/summaries',
                method: 'GET'
            }).then(function(response) {
                // success callback
                this.$set('summaries', response.data);
            }, function(response) {
                // error callback
            });
        },

        methods: {
            markRead(id) {
                this.markedread = true;
                this.summaries[id - 1].read = true;
                this.markread = true;
                this.$dispatch('markRead');
            },
            markUnread(id) {
                this.markedread = false;
                this.summaries[id - 1].read = false;
                this.markread = false;
                this.$dispatch('markUnread');
            },
            messageDetail(id) {
                var self = this;

                this.$http({
                    url: 'http://localhost:3000/messages',
                    method: 'GET'
                }).then(function(response) {
                    // success callback
                    var messages = response.data;
                    console.log(messages[id - 1]);
                    this.$set('typeid', messages[id - 1].typeid);
                    this.$set('id', messages[id - 1].id);
                    this.$set('mestitle', messages[id - 1].title);
                    this.$set('mescontent', messages[id - 1].content);
                    this.$set('author', messages[id - 1].author);
                    this.$set('sendtime', messages[id - 1].sendtime);
                    this.$set('markedread', messages[id - 1].markedread);
                }, function(response) {
                    // error callback
                });

                // 按id匹配messages
                // for (var i in messages) {
                //     if (messages.hasOwnProperty(i)) {
                //         if (id = messages[i].id) {
                //             console.log(messages[i]);
                //             this.$set('id',messages[i].id);
                //             this.$set('mestitle',messages[i].title);
                //             this.$set('mescontent',messages[i].content);
                //             this.$set('author',messages[i].author);
                //             this.$set('sendtime',messages[i].sendtime);
                //             this.$set('markedread',messages[i].markedread);
                //         }
                //     }
                // }
            }
        },

        components: {
            PulseLoader,
            'message-detail': Message
        }
    }
</script>
