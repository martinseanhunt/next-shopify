import styled from 'styled-components'
import formatMoney from '../../util/formatMoney'

const ProductPrice = ({
  loadingVariant,
  invalidVariant,
  price,
  available
}) => (
  <>
    <Price>
      {loadingVariant 
        ? '...'
        : invalidVariant 
          ? `This option is currently unavailable`
          : (
            <span>
              {formatMoney(price)}
              {!available && ' (Out of stock)'}
            </span>
          )     
      }
    </Price>
  </>
)

const Price = styled.span`${({ theme }) => `
  display: block;
  padding: 0 0 40px 0;
  font-weight: ${theme.fonts.weights.bold};
  font-size: ${theme.fonts.l.fontSize};
  text-transform: capitalize;
`}`

export default ProductPrice
