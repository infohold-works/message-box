var Vue = require('vue')
var VueRouter = require('vue-router')
var ConfigRouter = require('./router')
var VueResource = require('vue-resource')
var store = require('./vuex/store')
var sync = require('vuex-router-sync').sync

var App = require('./App.vue')
// plugins
// var Dropdown = require('./components/Dropdown.vue')

Vue.config.debug = true

// Install plugins
Vue.use(VueRouter)
Vue.use(VueResource)

Vue.http.options.root = '/root'
Vue.http.headers.common['Authorization'] = 'Basic YXBpOnBhc3N3b3Jk'
Vue.http.options.emulateJSON = true
Vue.http.options.emulateHTTP = true

// Set up a new router
var router = new VueRouter()
sync(store, router)
ConfigRouter(router)

// For every new route scroll to the top of the page
router.beforeEach(function() {
  window.scrollTo(0, 0)
})

// If no route is matched redirect home
router.redirect({
  '*': '/'
})

// Start up our app
router.start(App, '#root')
