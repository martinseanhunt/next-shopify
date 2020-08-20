import styled from 'styled-components'
import formatMoney from '../../util/formatMoney'

const CheckoutButton = ({
  webUrl,
  loadingCheckoutLink,
  updateCartLoading,
  lineItemsSubtotalPrice,
  onCheckountClick
}) => (
  <Checkout 
    href={webUrl ? webUrl: '#'}
    onClick={onCheckountClick}
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
)

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

export default CheckoutButton
