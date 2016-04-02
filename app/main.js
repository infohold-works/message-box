// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.
var electron = require('electron');
var app = require('app');
var BrowserWindow = require('browser-window');
var env = require('./vendor/electron_boilerplate/env_config');
var devHelper = require('./vendor/electron_boilerplate/dev_helper');
var windowStateKeeper = require('./vendor/electron_boilerplate/window_state');

var notifier = require('node-notifier');
// 全局notifier
global.notifier = notifier;

var os = require('os');
console.log(os.platform());
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
        // mainWindow.openDevTools();
    }

    // mainWindow.webContents.on('did-finish-load', function() {
    //     mainWindow.webContents.send('ping', 'whoooooooh!');
    // });

    // ipcMain.on('asynchronous-message', function(event, arg) {
    //     console.log(arg);  // prints "ping"
    //     event.sender.send('asynchronous-reply', 'pong');
    // });

    mainWindow.on('close', function() {
        mainWindowState.saveState(mainWindow);
    });

    tray = new Tray(__dirname + '\\assets\\img\\icon.png');
    var trayMenuTemplate = [{
        label: '显示主窗口',
        click: function() {
            // ipc.send('open-main-window');
            if (mainWindow) {
                return;
            }
        }
    }, {
        label: '最小化窗口',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
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
            // ipc.send('close-main-window');
            app.quit();
        }
    }];
    var contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    tray.setToolTip('消息盒子');
    tray.setContextMenu(contextMenu);

});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});
