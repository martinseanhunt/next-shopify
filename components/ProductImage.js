import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'

// TODO: move this in to common and use it in the cart lineItems also

const ProductImage = ({ image, showOutOfStock, autoHeight }) => (
  <ImageContainer 
    showOutOfStock={showOutOfStock}
    autoHeight={autoHeight}
  >
    {image 
      ? <img src={image.transformedSrc} alt={image.altText} /> 
      : <FontAwesomeIcon icon={faImage} />
    }
  </ImageContainer>
)

const ImageContainer = styled.div`${({ 
  theme, 
  showOutOfStock, 
  autoHeight 
}) => `
  height: ${autoHeight ? 'auto' : '340px'};
  min-height: 300px;
  background-color: ${theme.colors.lightGrey};
  background-position: center;
  background-repeat: no-repeat;
  color: ${theme.colors.medDarkGrey};
  font-size: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  img { 
    width: 100%;
    ${!autoHeight && `
      height: 100%;
      object-fit: cover;
    `}
  }

  ${showOutOfStock && `
    &::after {
      position: absolute;
      top: 0;
      left: 0;
      content: 'Out of Stock';
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      color: ${theme.colors.white};
      font-size: ${theme.fonts.l.fontSize};
      font-size: ${theme.fonts.weights.medium};
      background: ${theme.colors.darkTransparentBlack};
    }
  `}
`}`

export default ProductImage
