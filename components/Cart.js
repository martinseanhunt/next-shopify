import { useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons'

import { useCartContext } from '../contexts/cart/CartContext'

const Cart = () => {
  const { state, dispatch } = useCartContext()

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
    console.log('loading from local')
    const localCart = typeof window === 'object'
      && localStorage.getItem('cart')
      && JSON.parse(localStorage.getItem('cart'))
          
    if(!state.id && localCart && localCart.id) initializeCart({
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
    if(state.notifyItemAdded) setTimeout(() => 
      dispatch({ type: 'SET_NOTIFY_ITEM_ADDED', payload: false })
    , 3000)
    
  }, [state.notifyItemAdded])

  // TODO: FIX!
  const cartIcon = (
    <>
    <FontAwesomeIcon icon={faShoppingBasket} />
    <span>
      {/* TODO: Loading spinner */}
      {cartLoading 
        ? '...' 
        : state.lineItems ? state.lineItems.edges.length : '0'
      }
    </span>
    </>
  )

  return (
    <CartContainer>
      <CartNotification visible={state.notifyItemAdded}>
        Item added to cart 🙌🏼
      </CartNotification>
      
      {state.webUrl ? (
        <a href={state.webUrl}>
          {cartIcon}
        </a>
      ) : (
        <div>
          {cartIcon}
        </div>
      )}
      
    </CartContainer>
  )
}

const CartContainer = styled.div`${({ theme }) => `
  font-size: ${theme.fonts.ml.fontSize};
  position: relative;

  span {
    font-size: ${theme.fonts.m.fontSize};
    font-weight: ${theme.fonts.weights.medium};
    padding-left: 5px;
  }
`}`

const CartNotification = styled.div`${({ theme, visible }) => `
  position: absolute; 
  font-size: ${theme.fonts.m.fontSize};
  background: ${theme.colors.lightBeige};
  border: 1px solid ${theme.colors.beigeHighlight};
  border-radius: 10px;
  padding: 8px 3px;
  opacity: ${visible ? 1 : 0}; 
  visibility: ${visible ? 'visible' : 'hidden'}; 
  transform: scale(${visible ? 1 : 0.7});
  pointer-events: none;
  top: -50px;
  right: 0;
  width: 150px;
  transition: all 0.2s;
  text-align: center;
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
            id
            image {
              transformedSrc(maxWidth: 200)
            }
            priceV2 {
              amount
              currencyCode
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
