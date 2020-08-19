import React, { useContext, createContext, useReducer } from 'react'

import cartReducer, { initialState } from './cartReducer'

// TODO This whole context should be replaced by the Apollo cache
// No time to redo this

const CartContext = createContext()
const useCartContext = () => useContext(CartContext)

const CartContextProvider = props => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

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
