// global actions
export const setSocket = makeAction('SET_SOCKET')

// login actions
export const toggleLoading = makeAction('TOGGLE_LOADING')
export const toggleLogin = makeAction('TOGGLE_LOGIN')
export const setUserName = makeAction('SET_USERNAME')

// sidebar actions
export const toggleRouter = makeAction('TOGGLE_ROUTER')


function makeAction (type) {
  return ({ dispatch }, ...args) => dispatch(type, ...args)
}
