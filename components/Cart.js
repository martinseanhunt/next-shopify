import { useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'
import styled, { keyframes, css } from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons'

import { useCartContext } from '../contexts/cart/CartContext'

const Cart = () => {
  const { state: { 
    id, 
    notifyItemAdded, 
    lineItems, 
    webUrl 
  }, dispatch } = useCartContext()

  const [initializeCart, { loading: cartLoading }] = useMutation(
    UPDATE_CART_MUTATION,
    { 
      onCompleted: data => 
        dispatch({ 
          type: 'INITIALIZE_CART',
          payload: data.checkoutLineItemsReplace.checkout 
        })
      ,
      onError: error => 
        console.log("Couldn't load the cart, it's probably expired")
    }
  )

  // If we have a cart in localstorage and no current cart lets initialize it
  useEffect(() => {
    const localCart = typeof window === 'object'
      && localStorage.getItem('cart')
      && JSON.parse(localStorage.getItem('cart'))
          
    if(!id && localCart && localCart.id) initializeCart({
      variables: {
        checkoutId: localCart.id,
        lineItems: localCart.lineItems.edges.map(({ node }) => ({
          variantId: node.variant.id,
          quantity: node.quantity
        }))
      }
    })
  }, [])

  useEffect(() => {
    if(notifyItemAdded) setTimeout(() => 
      dispatch({ type: 'SET_NOTIFY_ITEM_ADDED', payload: false })
    , 2000)
    
  }, [notifyItemAdded])

  return (
    <CartContainer notifyItemAdded={notifyItemAdded}>
      <a href={webUrl ? webUrl: '#'}>
        <FontAwesomeIcon icon={faShoppingBasket} />
        <span>
          {/* TODO: Loading spinner */}
          {cartLoading 
            ? '...' 
            : lineItems ? lineItems.edges.length : '0'
          }
        </span>
      </a>
    </CartContainer>
  )
}

const pulse = keyframes`
  0% {
    transform: scale(1);
  }

  70% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
`

const CartContainer = styled.div`${({ theme, notifyItemAdded }) => css`
  font-size: ${theme.fonts.ml.fontSize};
  animation: ${notifyItemAdded ? css`${pulse} 0.5s 2`: 'none'};

  span {
    font-size: ${theme.fonts.m.fontSize};
    font-weight: ${theme.fonts.weights.medium};
    padding-left: 5px;
  }
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
