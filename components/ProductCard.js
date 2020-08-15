import { gql } from '@apollo/client'
import styled from 'styled-components'
import Link from 'next/link'

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
    <Link href={`/collection/${collection}/${product.handle}`}>
      <a>
        <article>
          <ImageContainer>
            {image ? <img src={image.transformedSrc} alt={image.altText} /> : null}
          </ImageContainer>
          <h3>{title}</h3>
          <strong>{price}</strong>
          <span>{description}</span>
        </article>
     </a>
    </Link>
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
