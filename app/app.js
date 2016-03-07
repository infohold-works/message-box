var Vue = require('vue')
var Router = require('vue-router')
var Resource = require('vue-resource')

var App = require('./App.vue')
var Main = require('./components/Main.vue')
var About = require('./components/About.vue')
var Fullreponame = require('./components/Fullreponame.vue')

// Install plugins
Vue.use(Router)
Vue.use(Resource)

// Set up a new router
var router = new Router()

// Route config
router.map({
    '/': {
        name: 'main',
        component: Main
    },
    '/about': {
        name: 'about',
        component: About
    },
    ':type/:name': {
        component: Main
    }
})

// For every new route scroll to the top of the page
router.beforeEach(function() {
    window.scrollTo(0, 0)
})

// If no route is matched redirect home
router.redirect({
    '*': '/'
})

// Start up our app
router.start(App, '#app')
