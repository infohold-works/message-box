<script>
    module.exports = {
        name: "Sidebar",

        data: function() {
            return {
                mesTypes: [{
                    "id": 1,
                    "title": "部门通知",
                    "read": false,
                    "count": 13
                }, {
                    "id": 2,
                    "title": "业务通知",
                    "read": false,
                    "count": 7
                }, {
                    "id": 3,
                    "title": "到账通知",
                    "read": false,
                    "count": 0
                }, {
                    "id": 4,
                    "title": "对账通知",
                    "read": false,
                    "count": 0
                }, {
                    "id": 5,
                    "title": "测试消息",
                    "read": false,
                    "count": 6
                }]
            }
        },

        // // Anything within the ready function will run when the application loads
        // created: function() {
        //     // When the application loads, we want to call the method that initializes
        //     // some data
        //     this.fetchTypes();
        // },

        methods: {
            // We dedicate a method to retrieving and setting some data
            // fetchTypes: function() {
            //     this.$http.get('./assets/data/mesTypes.json', function(data) {
            //         this.$set('mesTypes', data);
            //     }).error(function(data, status, request) {
            //         console.log('fail' + status + "," + request);
            //     })
            // },
            allMessages() {
                return this.$route.router.go({
                    path: '/',
                    replace: true
                })
            },
            readMessages() {
                return this.$route.router.go({
                    path: '/message/read'
                });
            },
            unreadMessages() {
                return this.$route.router.go({
                    path: '/message/unread'
                });
            },
            typeMessages(title) {
                return this.$route.router.go({
                    path: '/type/' + title
                });
            },
            githubFileExplorer() {
                return this.$route.router.go({
                    path: '/github-file-explorer',
                    replace: true
                })
            }
        }
    }
</script>

<template>
    <!-- dashboard-sidebar -->
    <div class="dashboard-sidebar">
        <div class="sidebar-header">
            <h4 class="sidebar-header-text">消息盒子</h4>
        </div>
        <ul class="dashboard-list">
            <li class="dashboard-list-item" @click="allMessages()">
                <i class="fa fa-fw fa-list"></i> 所有消息
            </li>
            <li class="dashboard-list-item" @click="readMessages()">
                <i class="fa fa-fw fa-check"></i> 已读消息
            </li>
            <li class="dashboard-list-item" @click="unreadMessages()">
                <i class="fa fa-fw fa-history"></i> 未读消息
            </li>
            <li class="dashboard-list-item" @click="githubFileExplorer()">
                <i class="fa fa-fw fa-file-o"></i> Github文件浏览器
            </li>
        </ul>
        <ul class="dashboard-list">
            <li @click="typeMessages(mesType.title)" v-for="mesType in mesTypes" class="dashboard-list-item">
                <i class="fa fa-fw fa-rss"></i> {{ mesType.title }}
                <span class="type-count pull-right badge">{{ mesType.count }}</span>
            </li>
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
        width: 280px;
    }

    .dashboard-sidebar .sidebar-header {
        width: 280px;
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
        background: rgba(255, 255, 255, 0.05);
        color: #fff;
    }

    .dashboard-sidebar .dashboard-list .dashboard-list-item:first-child,
    .dashboard-sidebar .dashboard-list .dashboard-list-item:only-child {
        border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    .dashboard-sidebar .dashboard-list .dashboard-list-item:hover {
        background: rgba(255, 255, 255, 0.03);
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
