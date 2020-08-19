import { useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import styled from 'styled-components'

import { useCartContext } from '../../contexts/cart/CartContext'
import useHandleClickOutside from '../../hooks/useHandleClickOutside'
import useInitializeCartFromLocal from '../../hooks/useInitializeCartFromLocal'
import apolloErrorHandler from '../../util/apolloErrorHandler'

import OpenCartButton from './OpenCartButton'
import CartDetails from './CartDetails'

const Cart = () => {
  const { state: { 
    notifyItemAdded, 
    lineItems
  }, dispatch } = useCartContext()

  const [cartOpen, setCartOpen] = useState(false)
  const cartLoading = useInitializeCartFromLocal()

  const [cartDetailsRef, openCartButtonRef] = useHandleClickOutside(
    () => setCartOpen(false)
  )

  // TODO: Think about whether it makes more sense for the mutation 
  // gql tags to live here or down in cart details

  // TODO: We could use an optimistic response here so that we show the  
  // updated quantities immediately and do the legwork behind the scenes
  const [updateCart, { loading: updateCartLoading }] = useMutation(
    UPDATE_CART_MUTATION,
    { 
      onCompleted: data => {
        const checkout = data.checkoutLineItemsReplace.checkout        
        if(!checkout.lineItems.edges.length) setCartOpen(false) 
        
        dispatch({ 
          type: 'UPDATE_CART_FROM_CHECKOUT',
          payload: data.checkoutLineItemsReplace.checkout 
        }) 
      },
      onError: apolloErrorHandler
    }
  )
  
  // Clear the added to cart notification after x time
  useEffect(() => {
    if(notifyItemAdded) setTimeout(() => 
      dispatch({ type: 'SET_NOTIFY_ITEM_ADDED', payload: false })
    , 2000)
    
  }, [notifyItemAdded])

  const hasLineItems = lineItems && lineItems.edges && lineItems.edges.length

  return (
    <>
      <CartContainer>
        <OpenCartButton 
          onOpenCart={() => setCartOpen(!cartOpen)}
          openCartButtonRef={openCartButtonRef}
          hasLineItems={hasLineItems}
          lineItems={lineItems}
          notifyItemAdded={notifyItemAdded}
          cartLoading={cartLoading}
        />
        {cartOpen && hasLineItems && (
          <CartDetails 
            cartDetailsRef={cartDetailsRef}
            updateCartLoading={updateCartLoading}
            updateCart={updateCart}
          />
        )}
      </CartContainer>
    </>
  )
}

const CartContainer = styled.div`${({ theme }) => `
  font-size: ${theme.fonts.ml.fontSize};
  position: relative;
`}`

const CHECKOUT_FRAGMENT = gql`
  fragment CheckoutFragment on Checkout {
    id
    lineItems(first: 250) {
      edges {
        node {
          id
          quantity
          title
          variant {
            available
            availableForSale
            priceV2{ amount, currencyCode }
            id
            sku
            title
            image {
              originalSrc
              altText
              transformedSrc(maxWidth: 245)
            }
          }
        }
      }
    }
    lineItemsSubtotalPrice {
      amount
      currencyCode
    }
    webUrl
  }
`

export const CREATE_CART_MUTATION = gql`
  mutation CreateCart(
    $input: CheckoutCreateInput!
  ) {
    checkoutCreate(
      input: $input
    ) {
      checkout {
        ...CheckoutFragment
      }
      checkoutUserErrors {
        message
      }
    }
  }
  ${CHECKOUT_FRAGMENT}
`

// TODO: finish this and use fragment for response
export const UPDATE_CART_MUTATION = gql`
  mutation UpdateCart(
    $lineItems: [CheckoutLineItemInput!]!
    $checkoutId: ID!
  ) {
    checkoutLineItemsReplace(
      lineItems: $lineItems
      checkoutId: $checkoutId
    ) {
      checkout {
        ...CheckoutFragment
      }
      userErrors {
        message
        field
      }
    }
  }
  ${CHECKOUT_FRAGMENT}
`

export default Cart
