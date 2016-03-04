var Vue = require('vue')
var Router = require('vue-router')
var Resource = require('vue-resource')

var App = require('./App.vue')
//var Main = require('./components/Main.vue')
//var About = require('./components/About.vue')
//var Fullreponame = require('./components/Fullreponame.vue')
var Login=require('./components/Login.vue')

// Install plugins
Vue.use(Router)
Vue.use(Resource)

// Set up a new router
var router = new Router()

// Route config
router.map({
    '/login':{
      name:'login',
      component : Login
    },
    //'/': {
    //    name: 'main',
    //    component: Main
    //},
    //'/about': {
    //    name: 'about',
    //    component: About
    //},
    //'/github-file-explorer': {
    //    name: 'github-file-explorer',
    //    component: Fullreponame
    //},
    //':type/:name': {
    //    component: Main
    //}
})

// For every new route scroll to the top of the page
router.beforeEach(function() {
    window.scrollTo(0, 0)
})

// If no route is matched redirect home
router.redirect({
    '*': '/login'
})
//连接服务端
//var socket = io.connect('http://192.168.1.139:8090');
// Start up our app
router.start(Login, "#app")
