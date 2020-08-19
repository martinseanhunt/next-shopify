import { useState } from 'react'
import styled from 'styled-components'

import { useCartContext } from '../../contexts/cart/CartContext'
import formatMoney from '../../util/formatMoney'

import LineItem from './LineItem'

const CartDetails = ({ 
  cartDetailsRef, 
  updateCartLoading,
  updateCart 
}) => {
  // TODO: Think about whether it's best to get this data straight from
  // the context or just pass it down from the parent via props...
  // I'm assuming it would be more performant to pass down from the parent
  // and reduce calls to useCartContext but I want to do look in to that more
  const { state: { 
    id: checkoutId, 
    lineItems, 
    webUrl,
    lineItemsSubtotalPrice
  } } = useCartContext()

  const [updatingItemId, setUpdatingItemId] = useState(null)
  const [deletingItemId, setDeletingItemId] = useState(null)
  const [loadingCheckoutLink, setLoadingCheckoutLink] = useState(false)

  const onUpdateQuantity = async (variantId, quantity) => {
    const newLineItems = lineItems.edges.map(({ node }) => ({
      variantId: node.variant.id,
      quantity: variantId === node.variant.id 
        ? quantity
        : node.quantity
    }))

    // Set a loading state for the individual line item as the apollo loading
    // state will be true for all line items. and we only wany to visually
    // signify this one is loading
    setUpdatingItemId(variantId)

    await updateCart({
      variables: {
        checkoutId,
        lineItems: newLineItems
      }
    })

    setUpdatingItemId(null)
  }

  const onDeleteItem = async (variantId) => {
    // Seperate loading state for the individual variants delete button
    setDeletingItemId(variantId)
    
    await updateCart({ variables: {
      checkoutId,
      lineItems: lineItems.edges
        .filter(({ node }) => node.variant.id !== variantId)
        .map(({ node }) => ({
          variantId: node.variant.id,
          quantity: node.quantity
        }))
    } })

    setDeletingItemId(null)
  }

  return (
    <DetailsContainer ref={cartDetailsRef}>
      <LineItems>
        {lineItems.edges.map(({ node }) => (
          <LineItem 
            key={node.id}
            item={node} 
            onUpdateQuantity={onUpdateQuantity}
            onDeleteItem={onDeleteItem}
            updateCartLoading={updateCartLoading}
            updatingItemId={updatingItemId}
            deletingItemId={deletingItemId}
          />
        ))}
      </LineItems>
      <Checkout 
        href={webUrl ? webUrl: '#'}
        onClick={() => setLoadingCheckoutLink(true)}
      >
        {loadingCheckoutLink ? '...' : (
          <>
            Checkout (
              <b>
                {updateCartLoading
                  ? '...' 
                  : formatMoney(lineItemsSubtotalPrice)
                }
              </b>
            )
          </>
        )}
      </Checkout>
    </DetailsContainer>
  )
}

const DetailsContainer = styled.div`${({ theme }) => `
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
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
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

export default CartDetails
