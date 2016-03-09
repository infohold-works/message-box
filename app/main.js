// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

var io = require('socket.io')(8090);
var app = require('app');
var BrowserWindow = require('browser-window');
var env = require('./vendor/electron_boilerplate/env_config');
var devHelper = require('./vendor/electron_boilerplate/dev_helper');
var windowStateKeeper = require('./vendor/electron_boilerplate/window_state');

var mainWindow;
var map = new Map();
var user = new Map();
user.put(123456,1234567);  //测试用user数据
var onlineUsers = {};
var socketid;
// Preserver of the window size and position between app launches.
var mainWindowState = windowStateKeeper('main', {
    width: 1024,
    height: 768
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('login', function(obj){
        socket.name = obj.userId;//将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
        map.put(obj.userId,socket.id);

        var pwd;
        if(user.get(obj.userId)){  //如果用户列表中有此userId
            pwd = user.get(obj.userId);  //获取密码
            if(obj.password == pwd){
                socketid = map.get(obj.userId);  //获取登录用户的socketid
                io.sockets.connected[socketid].emit('login',{data:0});
                if(!onlineUsers.hasOwnProperty(obj.userId)) {   //判断在线列表是否有此userid
                    onlineUsers[obj.userId] = socketid;       //将此userid加入在线列表
                }
            }else { //如果用户列表中没有此userId
                socketid = map.get(obj.userId);  //获取登录用户的socketid
                io.sockets.connected[socketid].emit('login',{data:1});  //发送失败标志
                map.remove(obj.userId);  //删除此socketid
            }
        }else {   //如果没有此userId
            socketid = map.get(obj.userId);  //获取socketid
            io.sockets.connected[socketid].emit('login',{data:1});  //给客户端发送登录失败标志
            map.remove(obj.userId);  //删除此socketid
        }
    });

    //接收消息并发送给指定客户端
    socket.on('private message',function(obj){
        if(map.get(obj.username)){
            socketid = map.get(obj.username);
            console.log(socketid)
            io.sockets.connected[socketid].emit('private message',obj);
        }
    });
    //推送给所有客户端
    socket.on('public message',function(obj){
        io.emit('public message',obj);
    });
    //监测登录成功的用户退出
    socket.on('disconnect', function(){
        if(onlineUsers.hasOwnProperty(socket.name)) {
            delete onlineUsers[socket.name];   //从在线列表删除
            map.remove(socket.name);    //从用户信息列表中删除
        }
    });
});

function Map() {
    this.elements = new Array();
    //获取MAP元素个数
    this.size = function() {
        return this.elements.length;
    };
    //判断MAP是否为空
    this.isEmpty = function() {
        return (this.elements.length < 1);
    };
    //删除MAP所有元素
    this.clear = function() {
        this.elements = new Array();
    };
    //向MAP中增加元素（key, value)
    this.put = function(_key, _value) {
        this.elements.push( {
            key : _key,
            value : _value
        });
    };
    //删除指定KEY的元素，成功返回True，失败返回False
    this.remove = function(_key) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    this.elements.splice(i, 1);
                    return true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };
    //获取指定KEY的元素值VALUE，失败返回NULL
    this.get = function(_key) {
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    return this.elements[i].value;
                }
            }
        } catch (e) {
            return null;
        }
    };
    //获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
    this.element = function(_index) {
        if (_index < 0 || _index >= this.elements.length) {
            return null;
        }
        return this.elements[_index];
    };
    //判断MAP中是否含有指定KEY的元素
    this.containsKey = function(_key) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    bln = true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };
    //判断MAP中是否含有指定VALUE的元素
    this.containsValue = function(_value) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].value == _value) {
                    bln = true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };
    //获取MAP中所有VALUE的数组（ARRAY）
    this.values = function() {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].value);
        }
        return arr;
    };
    //获取MAP中所有KEY的数组（ARRAY）
    this.keys = function() {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].key);
        }
        return arr;
    };
}

app.on('ready', function() {

    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height
    });

    if (mainWindowState.isMaximized) {
        mainWindow.maximize();
    }

    if (env.name === 'test') {
        mainWindow.loadURL('file://' + __dirname + '/spec.html');
    } else {
        mainWindow.loadURL('file://' + __dirname + '/app.html');
    }

    if (env.name !== 'production') {
        devHelper.setDevMenu();
        mainWindow.openDevTools();
    }

    mainWindow.on('close', function() {
        mainWindowState.saveState(mainWindow);
    });
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});
