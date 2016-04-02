var Vue = require('vue')
var Router = require('vue-router')
var Resource = require('vue-resource')

var App = require('./App.vue')
var Main = require('./components/Main.vue')
var About = require('./components/About.vue')
var Dropdown = require('./components/Dropdown.vue');

Vue.config.debug = true

// Install plugins
Vue.use(Router)
Vue.use(Resource)

Vue.http.options.root = '/root'
Vue.http.headers.common['Authorization'] = 'Basic YXBpOnBhc3N3b3Jk'
Vue.http.options.emulateJSON = true
Vue.http.options.emulateHTTP = true

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
