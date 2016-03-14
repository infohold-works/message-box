var io = require('socket.io')(3000);
// 连接mongodb
var conf = require('../../../config/env_development.json');
var connect = require('../../services/mongodb-server/server').connect(conf.test.url, conf.test.options);

//var map = new Map(); //login的用户的信息列表
//var user = new Map(); //用户列表
//user.put(123456, 1234567);
var socketid;
var pwd;
var password;

connect(function(db) {
    // Get the documents collection
    var collection = db.collection('mb_user');
    //更改登录状态
    function updateOnlineStat(username, stat) {
        collection.update({ username: username }, { $set: { online_stat: stat } });
    }
    //更改socketid
    function updateSocketId(username, socketid) {
        collection.update({ username: username }, { $set: { socketID: socketid } });
    }

    io.on('connection', function(socket) {
        console.log("a user connection")

        socket.on('login', function(obj) {
            updateSocketId(obj.username, "");  //清空数据库socketid
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
                        socketid = docs[0].socketID;
                        io.sockets.connected[socketid].emit('login', { data: 1 }); //给客户端发送登录失败标志
                        updateSocketId(obj.username, '');
                    }
                } else {
                    try{
                        socketid = socket.id;
                        io.sockets.connected[socketid].emit('login', { data: 1 }); //给客户端发送登录失败标志
                        console.log("没有此用户名");
                    }catch(e){
                        console.log("没有此用户名!!");
                    }
                }
            });
        });

        //接收消息并发送给指定客户端
        socket.on('private message', function(obj) {
            collection.find({ username: obj.username }).toArray(function(err, docs) {
                if (docs.length > 0) {
                    socketid = docs[0].socketID;
                    io.sockets.connected[socketid].emit('private message', obj);
                }
            });
        });
        //推送给所有客户端
        socket.on('public message', function(obj) {
            io.emit('public message', obj);
        });

        //监测登录成功的用户退出
        socket.on('disconnect', function() {
            collection.find({ username: socket.name }).toArray(function(err, docs) {
                try{
                    if (docs[0].online_stat) {
                        console.log(socket.name + "退出了");
                        updateOnlineStat(socket.name, false);
                        updateSocketId(socket.name, "");
                    }
                }catch(e){
                }
            });
        });
    });
});
