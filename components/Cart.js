import { useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import styled, { keyframes, css } from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons'

import { useCartContext } from '../contexts/cart/CartContext'
import useHandleClickOutside from '../hooks/useHandleClickOutside'

const Cart = () => {
  const { state: { 
    id, 
    notifyItemAdded, 
    lineItems, 
    webUrl 
  }, dispatch } = useCartContext()

  const [cartOpen, setCartOpen] = useState(false)
  const [cartDetailsRef, openCartButtonRef] = useHandleClickOutside(
    () => setCartOpen(false)
  )

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

  // TODO: use reusable component from closing navigation on click outside
  // use the appoach I'm using here where the button ony ever opens then the click outside will catch and close
  return (
    <CartContainer notifyItemAdded={notifyItemAdded}>
      <OpenCartButton 
        onClick={() => setCartOpen(!cartOpen)}
        ref={openCartButtonRef}
      >
        <FontAwesomeIcon icon={faShoppingBasket} />
        <span>
          {/* TODO: Loading spinner */}
          {cartLoading 
            ? '...' 
            : lineItems ? lineItems.edges.length : '0'
          }
        </span>
      </OpenCartButton>
      {cartOpen && (
        <CartDetails ref={cartDetailsRef}>
          <LineItems>
            {lineItems.edges.length && lineItems.edges.map(({ node }) => (
              <LineItem>
                <img src={node.variant.image.transformedSrc} alt={node.title} />

                <div>
                  <h4>
                    {node.title}
                    {node.variant.title !== 'Default Title' && (
                      <span> ({node.variant.title})</span>
                    )}
                  </h4>
                  <Controls>
                    <Quantity>
                      <button>-</button>
                      <span>{node.quantity}</span>
                      <button>+</button>
                    </Quantity>
                    <Delete>x</Delete>
                  </Controls>
                </div>
              </LineItem>
            ))}
          </LineItems>
          <Checkout href={webUrl ? webUrl: '#'}>Checkout</Checkout>
        </CartDetails>
      )}
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
  position: relative;
`}`

const OpenCartButton = styled.button`${({ theme }) => `
  padding: 0; 
  border: 0;
  background: none;
  outline: none;
  font-size: ${theme.fonts.ml.fontSize};
  cursor: pointer;
  
  span {
    font-size: ${theme.fonts.m.fontSize};
    font-weight: ${theme.fonts.weights.medium};
    padding-left: 5px;
  }
`}`

const CartDetails = styled.div`${({ theme }) => `
  font-size: ${theme.fonts.m.fontSize};
  background: ${theme.colors.lightBeige};
  border: 1px solid ${theme.colors.beigeHighlight};
  border-radius: 5px;
  padding: 20px 20px 0 20px;
  text-align: center;
  position: absolute;
  width: 300px;
  max-width: calc(100vw - ${theme.layout.gutters * 2}px);
  top: 30px;
  right: 0;
  z-index: 10;
`}`

const LineItems = styled.div`
  max-height: calc(100vh - 200px);
  overflow: scroll;
`

const LineItem = styled.div`${({ theme }) => `
  display: grid;
  grid-template-columns: 70px 1fr;
  margin-bottom: 15px;
  grid-gap: 15px;
  text-align: left;

  img  { 
    width: 100%;
    height: 70px;
    object-fit: cover;
  }

  h4 {
    font-size: ${theme.fonts.s.fontSize};
    font-weight: ${theme.fonts.weights.bold};
    color: ${theme.colors.darkGrey};
    padding-bottom: 13px;
    padding-top: 10px;

    a:hover {
      text-decoration: underline;
    }

    span {
      font-weight: ${theme.fonts.weights.medium};
      color: ${theme.colors.medDarkGrey};
    }
  }
`}`

const Controls = styled.div`${({ theme }) => `
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    cursor: pointer;
    border: 1px solid ${theme.colors.medGrey};
    background: ${theme.colors.beigeHighlight};
    font-size: ${theme.fonts.m.fontSize};
    padding: 3px 8px;
    transition: scale: 0.2s;

    &:last-child {
      border-radius: 5px;
    }

    &:hover {
      transform: scale(1.05);
    }
  }
`}`

const Quantity = styled.div`${({ theme }) => `
  display: flex;
  align-items: center;

  button {
    &:first-child {
      border-radius: 5px 0 0 5px;
    }
    &:last-child {
      border-radius: 0 5px 5px 0;
    }
  }

  span {
    border-top: 1px solid ${theme.colors.medGrey};
    border-bottom: 1px solid ${theme.colors.medGrey};
    background: ${theme.colors.beigeHighlight};
    padding: 4px 8px;
  }
`}`

const Delete = styled.button`
  margin-right: 20px;
`

const Checkout = styled.a`${({ theme }) => `
  cursor: pointer;
  border: 1px solid ${theme.colors.medGrey};
  background: ${theme.colors.beigeHighlight};
  font-size: ${theme.fonts.m.fontSize};
  padding: 10px 0;
  border-radius: 5px;
  margin: 15px 0;
  display: block;
  width: 100%;

  &:hover {
    transform: scale(1.01);
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
