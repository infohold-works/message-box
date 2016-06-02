// Route config
export default function(router) {
  router.map({
    '/': {
      name: 'main',
      component: require("./components/Main.vue")
    },
    ':type/:name': {
      component: require("./components/Main.vue")
    }
  })
}
