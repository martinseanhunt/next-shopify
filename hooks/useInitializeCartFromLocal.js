import { useEffect } from 'react'
import { useMutation } from '@apollo/client'

import { useCartContext } from '../contexts/cart/CartContext'
import { UPDATE_CART_MUTATION } from '../components/Cart/Cart'
import apolloErrorHandler from '../util/apolloErrorHandler'

// If we have a cart in localstorage and no current in the cart context cart
// lets initialize it
export const useInitializeCartFromLocal = () => {
  const { state: { id: loadedCartId }, dispatch } = useCartContext()

  const [initializeCart, { loading }] = useMutation(
    UPDATE_CART_MUTATION,
    { 
      onCompleted: data => 
        dispatch({ 
          type: 'INITIALIZE_CART',
          payload: data.checkoutLineItemsReplace.checkout 
        })
      ,
      onError: apolloErrorHandler
    }
  )

  useEffect(() => {
    const checkLocalStorageAndInitialize = () => {
      let localCart = typeof window === 'object'
        && localStorage.getItem('cart')
      
      try {
        localCart = localCart && JSON.parse(localStorage.getItem('cart'))
      } catch (e) {
        return console.log('invalid json in saved cart')
      }

      const isValidCart = localCart 
        && localCart.id 
        && localCart.lineItems
        && localCart.lineItems.edges
        && localCart.lineItems.edges.length
            
      if(isValidCart) return initializeCart({
        variables: {
          checkoutId: localCart.id,
          lineItems: localCart.lineItems.edges
          .filter(({ node }) => !!node)
          .map(({ node }) => ({
            variantId: node.variant.id,
            quantity: node.quantity
          }))
        }
      })

      console.log('Invalid cart object in localstorage')
    } 
    
    if(!loadedCartId) checkLocalStorageAndInitialize()
  }, [])

  return loading
}

export default useInitializeCartFromLocal
