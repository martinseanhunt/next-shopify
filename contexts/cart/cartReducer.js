const initialState = {
  notifyItemAdded: false
}

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
        notifyItemAdded: true
      })
    case 'UPDATE_CART':
      return persistState({
        ...state,
        ...payload,
        notifyItemAdded: true
      })
    case 'UPDATE_CART_FROM_CHECKOUT':
      return persistState({
        ...state,
        ...payload,
      })
    case 'INITIALIZE_CART':
      return persistState({
        ...state,
        ...payload,
      })
    case 'SET_NOTIFY_ITEM_ADDED':
      return {
        ...state,
        notifyItemAdded: payload
      }
    default:
      return state
  }
}

export default cartReducer
export { initialState }