import { useState } from 'react'
import styled from 'styled-components'

import { useCartContext } from '../../contexts/cart/CartContext'

import LineItem from './LineItem'
import CheckoutButton from './CheckoutButton'

const CartDetails = ({ 
  cartDetailsRef, 
  updateCartLoading,
  updateCart 
}) => {
  // TODO: Think about whether it's best to get this data straight from
  // the context or just pass it down from the parent via props...
  // I'm assuming it would be more performant to pass down from the parent
  // and reduce calls to useCartContext but I want to think more about the 
  // trade offs here.
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

    // Seperate loading state for the individual line item
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
        {lineItems.edges
          .filter(({ node }) => !!node)
          .map(({ node }) => (
            <LineItem 
              key={node.id}
              item={node} 
              onUpdateQuantity={onUpdateQuantity}
              onDeleteItem={onDeleteItem}
              updateCartLoading={updateCartLoading}
              updatingItemId={updatingItemId}
              deletingItemId={deletingItemId}
            />
          )
        )}
      </LineItems>
      <CheckoutButton 
        webUrl={webUrl}
        lineItemsSubtotalPrice={lineItemsSubtotalPrice}
        loadingCheckoutLink={loadingCheckoutLink}
        onCheckountClick={() => setLoadingCheckoutLink(true)}
        updateCartLoading={updateCartLoading}
      />
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

export default CartDetails
