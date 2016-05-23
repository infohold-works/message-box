// global actions
export const setModel = makeAction('SET_MODEL')
export const setSetting = makeAction('SET_SETTING')

// login actions
export const toggleLoading = makeAction('TOGGLE_LOADING')
export const toggleLogin = makeAction('TOGGLE_LOGIN')
export const setUser = makeAction('SET_USER')
export const setErrorMsg = makeAction('SET_ERROR_MSG')
export const updateUser = makeAction('UPDATE_USER')

// sidebar actions
export const toggleRouter = makeAction('TOGGLE_ROUTER')
export const setMessagetypes = makeAction('SET_MESSAGETYPES')
export const increaseCount = makeAction('INCREASE_COUNT')
export const decreaseCount = makeAction('DECREASE_COUNT')

// main actions
export const setMescontent = makeAction('SET_MESCONTENT')
export const addFeedback = makeAction('ADD_FEEDBACK')

function makeAction (type) {
  return ({ dispatch }, ...args) => dispatch(type, ...args)
}
