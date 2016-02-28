<script>
    var PulseLoader = require('vue-spinner/src/PulseLoader.vue'); //PulseLoader插件
    var Message = require('./Message.vue');

    module.exports = {
        name: 'Main',

        route: {
            data({ to }) {
              if(to.params.type === "type") {
                  this.title = to.params.name
                  this.state = 'type'
              }
              else if(to.params.type === "message" && to.params.name === "read") {
                  this.title = "已读消息"
                  this.state = 'read'
              }
              else if(to.params.type === "message" && to.params.name === "unread") {
                  this.title = "未读消息"
                  this.state = "unread"
              }
              else {
                  this.title = "所有消息"
                  this.state = "all"
              }
            }
        },

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
                state: ''
            }
        },

        computed: {
            messages() {
                return {
                    id: '1',
                    read: false,
                    mestitle: '标题',
                    mesdesc: '描述',
                    author: '小明',
                    sendtime: '2016-02-28 11:30:21'
                }
            }
        },

        methods: {
            markRead() {
                markRead(this.id);
                this.markedread = true;
            },
            markUnread() {
                markUnread(this.id);
                this.markedread = false;
            }
        },

        components: {
            PulseLoader,
            'message-detail': Message
        }
    }
</script>

<template>
    <div class="dashboard-header">
        <h4>{{ title }}</h4>
        <div class="form-group has-feedback dashboard-header-search pull-right">
            <input type="text" value="" placeholder="搜索" class="form-control" v-model="searchQuery" />
            <span class="form-control-feedback fui-search"></span>
        </div>
    </div>
    <div class="dashboard-messages">
        <!-- <pre>
            {{ $data | json }}
        </pre> -->
        <ul v-if="messages.length > 0" class="messages">
            <li :class="{ readed : message.read }" v-for="message in messages |
            filterBy searchQuery in 'title' 'context'" class="message" @:click="messageDetail(message._id)">
                <h3>{{ message.title }}</h3>
                <pre>
                    {{ $data | json }}
                </pre>
                <div class="description">
                    {{ message.summary }}
                </div>
            </li>
        </ul>
        <div class="empty-placeholder" v-if="messages.length == 0">暂时没有消息</div>
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
            <button v-if="!markedread" v-on:click="markRead()" type="button" class="toggle-tag-editor">
                <i class="fa fa-fw fa-check"></i> 标记为已读
            </button>
            <button v-if="markedread" v-on:click="markUnread()" type="button" class="toggle-tag-editor">
                <i class="fa fa-fw fa-history"></i> 标记为未读
            </button>
        </div>
        <message-detail :mestitle="mestitle" :sendtime="sendtime" :author="author" :content="mescontent" v-if="mescontent"></message-detail>
        <div class="empty-placeholder" v-if="!content">没有选择消息</div>
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
        left: 280px;
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

    .dashboard-messages {
        position: absolute;
        top: 60px;
        bottom: 0;
        left: 280px;
        background: #fafafa;
        overflow-y: auto;
        width: 360px;
    }

    .dashboard-message-detail {
        background: #fff;
        color: #2C3E50;
        position: absolute;
        top: 60px;
        left: 640px;
        right: 0;
        bottom: 0;
        min-width: 550px;
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

    .messages .message {
        background: #fff;
        background-clip: padding-box;
        border-bottom: 1px solid rgba(55, 53, 112, 0.1);
        cursor: pointer;
        display: block;
        margin: 0;
        padding: 20px;
    }
</style>
