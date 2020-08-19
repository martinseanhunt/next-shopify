import styled, { keyframes, css } from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons'

const OpenCartButton = ({
  onOpenCart,
  openCartButtonRef,
  hasLineItems,
  lineItems,
  notifyItemAdded,
  cartLoading
}) => (
  <ButtonContainer 
    onClick={onOpenCart}
    ref={openCartButtonRef}
    disabled={!hasLineItems}
    notifyItemAdded={notifyItemAdded}
  >
    <FontAwesomeIcon icon={faShoppingBasket} />
    <span>
      {cartLoading 
        ? '...' 
        : hasLineItems 
          ? lineItems.edges.reduce((count, { node }) => 
              count + node.quantity
            , 0)
          : '0'
      }
    </span>
  </ButtonContainer>
)

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

const ButtonContainer = styled.button`${({ theme, notifyItemAdded }) => 
  css`
    padding: 0; 
    border: 0;
    background: none;
    outline: none;
    font-size: ${theme.fonts.ml.fontSize};
    animation: ${notifyItemAdded ? css`${pulse} 0.5s 2`: 'none'};
    cursor: pointer;

    &:disabled {
      cursor: default;
    }
    
    span {
      font-size: ${theme.fonts.m.fontSize};
      font-weight: ${theme.fonts.weights.medium};
      padding-left: 5px;
    }
  `
}`

export default OpenCartButton
