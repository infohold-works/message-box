// Route config
export default function(router) {
  router.map({
    '/': {
      name: 'main',
      component: require("./components/main.vue")
    },
    ':type/:name': {
      component: require("./components/main.vue")
    }
  })
}
