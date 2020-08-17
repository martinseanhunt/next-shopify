import { gql } from '@apollo/client'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons'

import { useCartContext } from '../contexts/cart/CartContext'

const Cart = () => {
  const { state, dispatch } = useCartContext()

  console.log(state)
  
  return (
    <CartContainer>
      <a href={state.webUrl} disabled={!state.webUrl}>
        <FontAwesomeIcon 
          icon={faShoppingBasket} 
          title="Shopping Basket Icon"
        />
        <span>{state.lineItems ? state.lineItems.edges.length : '0'}</span>
      </a>
    </CartContainer>
  )
}

const CartContainer = styled.div`${({ theme }) => `
  font-size: ${theme.fonts.ml.fontSize};

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
            id
            image {
              transformedSrc(maxWidth: 200)
            }
            priceV2 {
              amount
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
