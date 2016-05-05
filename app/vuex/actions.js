// global actions
export const setSocket = makeAction('SET_SOCKET')

// login actions
export const toggleLoading = makeAction('TOGGLE_LOADING')
export const toggleLogin = makeAction('TOGGLE_LOGIN')
export const setUserName = makeAction('SET_USERNAME')

// sidebar actions
export const toggleRouter = makeAction('TOGGLE_ROUTER')
export const setMessagetypes = makeAction('SET_MESSAGETYPES')
export const increaseCount = makeAction('INCREASE_COUNT')
export const decreaseCount = makeAction('DECREASE_COUNT')

// main actions
export const setMescontent = makeAction('SET_MESCONTENT')

function makeAction (type) {
  return ({ dispatch }, ...args) => dispatch(type, ...args)
}
