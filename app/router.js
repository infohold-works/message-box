// Route config
export default function(router) {
  router.map({
    '/': {
      name: 'main',
      component: require("./components/main.vue")
    },
    '/about': {
      name: 'about',
      component: require("./components/about.vue")
    },
    ':type/:name': {
      component: require("./components/main.vue")
    }
  })
}
