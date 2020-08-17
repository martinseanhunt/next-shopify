const initialState = {}

const persistState = state => {
  localStorage.setItem('cart', JSON.stringify(state))
  return state
}

const cartReducer =(state, { type, payload }) => {
  let newState
  switch(type) {
    case 'CREATE_CART':
      return persistState({
        ...state,
        ...payload,
      })
    case 'UPDATE_CART':
      return persistState({
        ...state,
        ...payload,
      })
    case 'INITIALIZE_CART':
      return persistState({
        ...state,
        ...payload,
      })
    default:
      return state
  }
}

export default cartReducer
export { initialState }