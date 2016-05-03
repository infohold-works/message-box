// login actions
export const toggleLoading = makeAction('TOGGLE_LOADING')
export const toggleLogin = makeAction('TOGGLE_LOGIN')
export const setSocket = makeAction('SET_SOCKET')

function makeAction (type) {
  return ({ dispatch }, ...args) => dispatch(type, ...args)
}
