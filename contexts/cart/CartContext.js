import React, { useContext, createContext, useReducer } from 'react'

import cartReducer, { initialState } from './cartReducer'

// TODO This whole context could probably just be replaced by using the Apollo cache
// in a more intelligent way. Just doing this for the sake of dev speed

const CartContext = createContext()
const useCartContext = () => useContext(CartContext)

const CartContextProvider = props => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  console.log(state)

  const value = {
    state,
    dispatch
  }

  return (
    <CartContext.Provider value={props.value || value}>
      {props.children}
    </CartContext.Provider>
  )
}

export default CartContextProvider
export { useCartContext }