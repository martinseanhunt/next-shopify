
/*
  const cartId = typeof window === 'object' && localStorage.getItem('cartId')
  cartId: cartId && JSON.parse(cartId)
*/

const initialState = {
}

const cartReducer =(state, { type, payload }) => {
  switch(type) {
    case 'CREATE_CART':
      return {
        ...state,
        ...payload,
      }
    case 'UPDATE_CART':
      return {
        ...state,
        ...payload,
      }
    default:
      return state
  }
}

export default cartReducer
export { initialState }