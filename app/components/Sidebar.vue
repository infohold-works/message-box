<script>
  import {
    setMessagetypes,
    toggleRouter
  } from '../vuex/actions'
  // 连接mongodb
  var env_conf = require('../../config/env_development.json');
  var connect = require('../db').connect(env_conf.db.url, env_conf.db.options);
  var mesTypes = env_conf.messageTypes;

  module.exports = {
    name: "Sidebar",

    vuex: {
      getters: {
        userName: ({
          login
        }) => login.userName,
        messageTypes: ({
          sidebar
        }) => sidebar.messageTypes,
        isAll: ({
          sidebar
        }) => sidebar.router.isAll,
        isRead: ({
          sidebar
        }) => sidebar.router.isRead,
        isUnRead: ({
          sidebar
        }) => sidebar.router.isUnRead,
        isType: ({
          sidebar
        }) => sidebar.router.isType
      },
      actions: {
        setMessagetypes,
        toggleRouter
      }
    },

    ready: function() {
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
        }).toArray(function(err, result) {
          summaryCollection.find({
            userid: result[0].userid
          }).sort({
            "typeid": 1
          }).toArray(function(err, result) {
            self.setMessagetypes(mesTypes, result);
          });
        });
      });
    },

    methods: {
      allMessages() {
        this.toggleRouter('isAll', mesTypes);
        this.$dispatch('searchAll');
        return this.$route.router.go({
          path: '/',
          replace: true
        })
      },
      readMessages() {
        this.toggleRouter('isRead', mesTypes);
        this.$dispatch('searchRead');
        return this.$route.router.go({
          path: '/message/read'
        });
      },
      unreadMessages() {
        this.toggleRouter('isUnRead', mesTypes);
        this.$dispatch('searchUnread');
        return this.$route.router.go({
          path: '/message/unread'
        });
      },
      typeMessages(messageType) {
        this.toggleRouter('isType', mesTypes, messageType);
        this.$dispatch('searchType', messageType.id);
        return this.$route.router.go({
          path: '/type/' + messageType.title
        });
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
      <li class="dashboard-list-item" @click="allMessages()" :class="{active : isAll}">
        <i class="fa fa-fw fa-list"></i> 所有消息
      </li>
      <li class="dashboard-list-item" @click="readMessages()" :class="{active : isRead}">
        <i class="fa fa-fw fa-check"></i> 已读消息
      </li>
      <li class="dashboard-list-item" @click="unreadMessages()" :class="{active : isUnRead}">
        <i class="fa fa-fw fa-history"></i> 未读消息
      </li>
    </ul>
    <div class="sidebar-header">
      <h4 class="sidebar-header-text">类型</h4>
    </div>
    <ul class="dashboard-list">
      <li @click="typeMessages(messageType)" v-for="messageType in messageTypes" class="dashboard-list-item" :class="{active : messageType.selected}">
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

  .dashboard-sidebar .dashboard-list .dashboard-list-item.active {
    background: #1ABC9C;
    color: #fff;
  }

  .dashboard-sidebar .dashboard-list .dashboard-list-item.active:hover {
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
