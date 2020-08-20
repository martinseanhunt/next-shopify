import { useMutation } from '@apollo/client'
import styled from 'styled-components'

import apolloErrorHandler from '../../util/apolloErrorHandler'
import { useCartContext } from '../../contexts/cart/CartContext'
import { CREATE_CART_MUTATION, UPDATE_CART_MUTATION } from '../Cart/Cart'

const AddToCart = ({ 
  selectedVariant,
  quantitySelected,
  invalidVariant
}) => {
  const { state, dispatch } = useCartContext()

  const [createCart, { loading: createCartLoading }] = useMutation(
    CREATE_CART_MUTATION,
    { 
      onError: apolloErrorHandler,
      onCompleted: data => 
        dispatch({ 
          type: 'CREATE_CART',
          payload: data.checkoutCreate.checkout 
        })
    }
  )

  const [updateCart, { loading: updateCartLoading }] = useMutation(
    UPDATE_CART_MUTATION,
    { 
      onError: apolloErrorHandler,
      onCompleted: data => 
        dispatch({ 
          type: 'UPDATE_CART',
          payload: data.checkoutLineItemsReplace.checkout 
        }) 
    }
  )

  const onAddToCart = variant => {
    const { id, lineItems } = state
    const newItem = {
      quantity: quantitySelected,
      variantId: variant.id
    }

    if(id) {
      const newLineItems = lineItems.edges.map(({ node }) => ({
        variantId: node.variant.id,
        quantity: newItem.variantId === node.variant.id 
          ? node.quantity + newItem.quantity
          : node.quantity
      }))

      updateCart({
        variables: {
          checkoutId: id,
          lineItems: newLineItems
            .some(({ variantId }) => variantId === newItem.variantId)
              ? newLineItems
              : [...newLineItems, newItem]
        }
      })
    } else {
      createCart({
        variables: {
          input: { 
            lineItems: [newItem]
          }
        }
      })
    }
  }
  
  const loading = createCartLoading || updateCartLoading
  const disabled = createCartLoading 
    || updateCartLoading 
    || invalidVariant 
    || !selectedVariant.available

  return (
    <Actions>
      <AddToCartButton
        onClick={() => onAddToCart(selectedVariant)}
        disabled={disabled}
      >
        Add{loading && 'ing'} to cart{loading && '...'}
      </AddToCartButton>

      <CartNotification visible={state.notifyItemAdded}>
        Item added to cart 🙌🏼
      </CartNotification> 
    </Actions>
  )
}

const Actions = styled.div`
  position: relative;
`

const AddToCartButton = styled.button`${({ theme }) => `
  cursor: pointer;
  border: 1px solid ${theme.colors.medGrey};
  background: ${theme.colors.beigeHighlight};
  font-size: ${theme.fonts.m.fontSize};
  padding: 7px 40px;
  border-radius: 5px;
  margin-bottom: 35px;

  &:disabled {
    color: ${theme.colors.medDarkGrey};
    cursor: default;

    &:hover {
      transform: none;
    }
  }

  &:hover {
    transform: scale(1.01);
  }
`}`

const CartNotification = styled.div`${({ theme, visible }) => `
  font-size: ${theme.fonts.m.fontSize};
  background: ${theme.colors.lightBeige};
  border: 1px solid ${theme.colors.beigeHighlight};
  border-radius: 5px;
  padding: 9px;
  opacity: ${visible ? 1 : 0}; 
  visibility: ${visible ? 'visible' : 'hidden'}; 
  transform: scale(${visible ? 1 : 0.7});
  pointer-events: none;
  transition: all 0.2s;
  text-align: center;
  position: absolute;
  top: -1px;
  left 160px;
`}`

export default AddToCart
