import { gql } from '@apollo/client'
import styled from 'styled-components'
import Link from 'next/link'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'

const ProductCard = ({ product, collection }) => {  
  const { 
    images,
    priceRange: { minVariantPrice, maxVariantPrice },
    title,
    description,
  } = product

  const image = images.edges.length && images.edges[0].node
  
  const price = minVariantPrice.amount === maxVariantPrice.amount
    ? `£${parseFloat(minVariantPrice.amount)}`
    : `£${parseFloat(minVariantPrice.amount)} - ${parseFloat(maxVariantPrice.amount)}`

  return (
    <Link 
      href={'/[collectionHandle]/[productHandle]'}
      as={`/${collection}/${product.handle}`}
    >
      <a>
        <Product>
          <ImageContainer availableForSale={product.availableForSale}>
            {image 
              ? <img src={image.transformedSrc} alt={image.altText} /> 
              : <FontAwesomeIcon 
                  icon={faImage} 
                  title="Image placeholder"
                />
            }
          </ImageContainer>
          <h3>{title}</h3>
          <strong>{price}</strong>
          <span>{description}</span>
        </Product>
     </a>
    </Link>
  )
}

const Product = styled.div`${({ theme }) => `
  h3 {
    padding: 15px 0 8px 0;
    font-weight: ${theme.fonts.weights.bold};
    font-size: ${theme.fonts.m.fontSize};
    text-transform: capitalize;
  }

  strong { 
    font-size: ${theme.fonts.s.fontSize};
    font-weight: ${theme.fonts.weights.bold};
    display: block;
    padding-bottom: 15px;
  }

  span {
    color: ${theme.colors.medDarkGrey};
    font-weight: ${theme.fonts.weights.medium};
    font-size: ${theme.fonts.base.fontSize};
  }
`}`

const ImageContainer = styled.div`${({ theme, availableForSale }) => `
  height: 340px;
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
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  ${!availableForSale && `
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

export const PRODUCT_CARD_FRAGMENT = gql`
  fragment ProductCardFragment on Product {
    availableForSale
    handle 
    title
    description(truncateAt: 120)
    images(first: 1) {
      edges {
        node {
          altText
          transformedSrc(maxWidth: 300)
        }
      }
    }
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
  }
`

export default ProductCard
