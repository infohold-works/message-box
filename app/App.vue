<script>
    var Sidebar = require('./components/Sidebar.vue')
    var Login = require('./components/Login.vue')

    // 连接mongodb
    var MongoClient = require('mongodb').MongoClient,
        assert = require('assert');

    // Connection URL
    var url = 'mongodb://8.1.3.213:27017/test';
    // Use connect method to connect to the Server
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        findDocuments(db, function() {
            console.log('callback');
            db.close();
        });
    });

    var findDocuments = function(db, callback) {
        // Get the documents collection
        var collection = db.collection('messagebox');
        // Find some documents
        collection.find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            assert.equal(1, docs.length);
            console.log("Found the following records");
            console.dir(docs);
            callback(docs);
        });
    }

    module.exports = {
        name: "App",

        data: function() {
            return {
                isLogin: false,
                typeId: '',
                markRead: '',
            }
        },

        components: {
            Login,
            Sidebar
        },

        events: {
            'markRead': function() {
                this.$broadcast('siderbar-markRead');
            },
            'markUnread': function() {
                this.$broadcast('siderbar-markUnread');
            }
        }
    }
</script>
<template>
    <div class="login-style" v-if="!isLogin">
        <login :msg.sync="isLogin"></login>
    </div>
    <div class="dashboard" v-if="isLogin">
        <sidebar :typeid.sync="typeId" :markread.sync="markRead"></sidebar>
        <router-view :typeid.sync="typeId" :markread.sync="markRead"></router-view>
    </div>
</template>
