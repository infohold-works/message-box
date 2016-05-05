// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.
var electron = require('electron');
var app = require('app');
var BrowserWindow = require('browser-window');
var Dialog = require('dialog');
var env = require('./vendor/electron_boilerplate/env_config');
var devHelper = require('./vendor/electron_boilerplate/dev_helper');
var windowStateKeeper = require('./vendor/electron_boilerplate/window_state');
var path = require('path');
var notifier = require('node-notifier');
// 全局notifier
global.notifier = notifier;
// ipc进程间通讯主进程
var ipcMain = electron.ipcMain;
var Menu = electron.Menu;
var Tray = electron.Tray;

// for win10
// var WindowsToaster = require('node-notifier').WindowsToaster;
//
// var notifier = new WindowsToaster({
//     withFallback: false, // Fallback to Growl or Balloons?
//     customPath: void 0 // Relative path if you want to use your fork of toast.exe
// });

// var redis = require('redis'),
//     RDS_PORT = 6379,
//     RDS_HOST = '8.1.3.213',
//     RDS_OPTS = {},
//     client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);
//
// client.on('ready', function (err) {
//     console.log('ready');
// })

var mainWindow;
// Preserver of the window size and position between app launches.
var mainWindowState = windowStateKeeper('main', {
    width: 1024,
    height: 768
});
var tray = null;
var iconNew = path.join(__dirname, 'assets/img', 'iconNew.png');
var icon = path.join(__dirname, 'assets/img', 'icon.png');

app.on('ready', function() {

    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        title: "消息盒子"
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
        // mainWindow.openDevTools();
    }

    // mainWindow.webContents.on('did-finish-load', function() {
    //     mainWindow.webContents.send('ping', 'whoooooooh!');
    // });

    tray = new Tray(icon);
    var trayMenuTemplate = [{
        label: '显示主窗口',
        click: function() {
            // 恢复窗口
            mainWindow.restore();
        }
    }, {
        label: '最小化窗口',
        accelerator: 'CmdOrCtrl+M',
        click: function() {
            // 最小化窗口
            mainWindow.minimize();
        }
    }, {
        type: 'separator'
    }, {
        label: '设置',
        click: function() {
            // ipc.send('open-settings-window');
        }
    }, {
        type: 'separator'
    }, {
        label: '退出',
        click: function() {
            Dialog.showMessageBox({
                type: 'question',
                buttons: ['确定', '取消'],
                title: '退出消息盒子',
                cancelId: 99,
                message: '确定退出吗?'
            }, function(response) {
                console.log('Exit: ' + response);
                if (!response) app.quit();
            });
        }
    }];
    var contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    tray.setToolTip('消息盒子');
    tray.setTitle('消息盒子');
    tray.setHighlightMode(true);
    tray.on('click', function() {
        // 显示主窗口
        mainWindow.restore();
        // 获取焦点
        mainWindow.show();
    })
    tray.setContextMenu(contextMenu);

    // ipcMain.on('asynchronous-message', function(event, arg) {
    //     console.log(arg);  // prints "ping"
    //     event.sender.send('asynchronous-reply', 'pong');
    // });

    // 新消息修改托盘图标事件
    ipcMain.on('update-icon', function(event, arg) {
        if (arg === 'newMessage') {
            tray.setImage(iconNew);
        } else {
            tray.setImage(icon);
        }
    });

    // 新消息修改托盘图标事件
    ipcMain.on('restore-window', function(event, arg) {
        // 显示主窗口
        mainWindow.restore();
        // 获取焦点
        mainWindow.show();
    });

    // 退出事件
    ipcMain.on('exit', function(event, arg) {
        Dialog.showMessageBox({
            type: 'question',
            buttons: ['确定', '取消'],
            title: '退出消息盒子',
            cancelId: 99,
            message: '确定退出吗?'
        }, function(response) {
            console.log('Exit: ' + response);
            if (!response) app.quit();
        });
    });

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
