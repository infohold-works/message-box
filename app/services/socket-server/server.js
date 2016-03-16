var io = require('socket.io')(3000);
var moment = require('moment');
// 连接mongodb
var conf = require('../../../config/env_development.json');
var connect = require('../../services/mongodb-server/server').connect(conf.test.url, conf.test.options);
var socketid;
var pwd;
var password;

connect(function(db) {
    // Get the documents collection
    var collection = db.collection('mb_user');
    var summaries = db.collection('mb_summaries');
    var messages = db.collection('mb_messages');

    //更改登录状态
    function updateOnlineStat(username, stat) {
        collection.update({ username: username }, { $set: { online_stat: stat } });
    }
    //更改socketid
    function updateSocketId(username, socketid) {
        collection.update({ username: username }, { $set: { socketID: socketid } });
    }
    //更新当前登录时间
    function updateLoginTime(username, nowtime) {
        collection.update({ username: username }, { $set: { login_time: nowtime } });
    }
    //更新上一次登录时间
    function updateLastLoginTime(username) {
        collection.find({ username: username }).toArray(function(err, docs) {
            collection.update({ username: username }, { $set: { last_login_time: docs[0].login_time } });
        });
    }
    //每次重启服务器时,重置用户登录状态和socketid
    //collection.find({}).toArray(function(err,docs){
    //   for(var i=0;i<docs.length;i++){
    //       collection.update({username:docs[i].username},{ $set: { online_stat:false,socketID:""} });
    //   }
    //});

    io.on('connection', function(socket) {
        console.log("a user connection");

        socket.on('login', function(obj) {
            collection.find({ username: obj.username }).toArray(function(err, docs) {
                if (docs.length > 0) { //判断是否有此用户
                    updateSocketId(obj.username, socket.id); //将此用户socketid添加到数据库
                    if (!docs[0].online_stat) {
                        pwd = docs[0].password;
                        if (obj.password == pwd) {
                            collection.find({ username: obj.username }).toArray(function(error, doc) {
                                socketid = doc[0].socketID; //获取socketid
                                io.sockets.connected[socketid].emit('login', { data: 0 }); //发送登录成功标识
                                socket.name = obj.username; //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
                                updateOnlineStat(obj.username, true);
                                updateLastLoginTime(obj.username); //更新上一次登录时间
                                updateLoginTime(obj.username, nowTime()); //添加当前时间
                                console.log(obj.username + "登录成功");
                            });
                        } else {
                            console.log("密码不正确!")
                            try {
                                collection.find({ username: obj.username }).toArray(function(error, doc) {
                                    socketid = doc[0].socketID; //获取socketid
                                    io.sockets.connected[socketid].emit('login', { data: 1 }); //发送登录失败标识
                                    updateSocketId(obj.username, '');
                                });
                            } catch (e) {
                                console.log("密码不正确!")
                            }
                        }
                    } else {
                        console.log("此用户已登录");
                        collection.find({ username: obj.username }).toArray(function(err, d) {
                            socketid = d[0].socketID;
                            io.sockets.connected[socketid].emit('login', { data: 3 }); //给客户端发送已登录标志
                        });
                    }
                } else { //如果没有此用户
                    try {
                        socketid = socket.id;
                        io.sockets.connected[socketid].emit('login', { data: 2 }); //给客户端发送没有用户名标志
                        console.log("没有此用户名");
                    } catch (e) {
                        console.log("没有此用户名!!");
                    }
                }
            });
        });

        //接收消息并发送给指定客户端
        socket.on('private message', function(obj) {
            summaries.find({}).toArray(function(err, docs) {
                summaries.save({
                    type: "private",
                    user_id: obj.userid,
                    user_brc: "",
                    id: docs.length + 1,
                    typeid: +obj.typeid,
                    title: obj.title,
                    author: obj.author,
                    desc: obj.content.substr(0, 50),
                    sendtime: nowTime(),
                    read: false
                });
                messages.save({
                    id: docs.length + 1,
                    typeid: +obj.typeid,
                    title: obj.title,
                    author: obj.author,
                    content: obj.content,
                    sendtime: nowTime(),
                });
                collection.find({ userid: obj.userid }).toArray(function(err, d) {
                    if (d[0].online_stat) { //查询用户是否在线
                        socketid = d[0].socketID;
                        io.sockets.connected[socketid].emit('private message', {
                            id: docs.length + 1,
                            typeid: +obj.typeid,
                            title: obj.title,
                            author: obj.author,
                            sendtime: nowTime(),
                            read: false,
                            desc: obj.content.substr(0, 50),
                            content: obj.content,
                            markedread: false
                        });
                    }
                });
            });
        });
        //推送给所有客户端
        socket.on('public message', function(obj) {
            summaries.find({}).toArray(function(err, docs) {
                summaries.save({
                    user_id: "",
                    type: "public",
                    user_brc: "",
                    id: docs.length + 1,
                    typeid: +obj.typeid,
                    title: obj.title,
                    author: obj.author,
                    desc: obj.content.substr(0, 50),
                    sendtime: nowTime(),
                    read: false
                });
                messages.save({
                    id: docs.length + 1,
                    typeid: +obj.typeid,
                    title: obj.title,
                    author: obj.author,
                    content: obj.content,
                    sendtime: nowTime(),
                });
                io.emit('public message', {
                    id: docs.length + 1,
                    typeid: +obj.typeid,
                    title: obj.title,
                    author: obj.author,
                    sendtime: nowTime(),
                    read: false,
                    desc: obj.content.substr(0, 50),
                    content: obj.content,
                    markedread: false
                });
            });
        });

        //监测登录成功的用户退出
        socket.on('disconnect', function() {
            collection.find({ username: socket.name }).toArray(function(err, docs) {
                try {
                    if (docs[0].online_stat) {
                        console.log(socket.name + "退出了");
                        updateOnlineStat(socket.name, false);
                        updateSocketId(socket.name, "");
                    }
                } catch (e) {}
            });
        });
    });
});

// 生成当前时间
function nowTime() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}
