import { gql } from '@apollo/client'
import styled from 'styled-components'

const ProductCard = ({ product }) => {  
  const { 
    images,
    priceRange: { minVariantPrice, maxVariantPrice },
    title,
    description,
    variants
  } = product

  const image = images.edges.length && images.edges[0].node
  
  const price = minVariantPrice.amount === maxVariantPrice.amount
    ? `£${parseFloat(minVariantPrice.amount)}`
    : `£${parseFloat(minVariantPrice.amount)} - ${parseFloat(maxVariantPrice.amount)}`

  return (
    <article>
      <ImageContainer>
        {image ? <img src={image.transformedSrc} alt={image.altText} /> : null}
      </ImageContainer>
      <h3>{title}</h3>
      <strong>{price}</strong>
      <span>{description}</span>
    </article>
  )
}

const ImageContainer = styled.div`
  height: 340px;
  background-color: ${({ theme }) => theme.colors.medGrey};
  background-image: url('/product-placeholder.png');
  background-position: center;
  background-repeat: no-repeat;
  
  img { 
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
`

export const PRODUCT_CARD_FRAGMENT = gql`
  fragment ProductCardFragment on Product {
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
