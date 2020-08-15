import { gql } from '@apollo/client'
import styled from 'styled-components'

const ProductCard = ({ product: p }) => {  
  const image = p.images.edges.length && p.images.edges[0].node

  return (
    <article>
      {image 
        ? <Image src={image.transformedSrc} alt={image.altText} />
        : <Image src={'/product-placeholder.jpg'} alt="placeholder image" />
      }
      <h3>{p.title}</h3>
      <strong>{p.variants.edges[0].node.priceV2.amount}</strong>
    </article>
  )
}

const Image = styled.img`
  width: 100%;
`

export const PRODUCT_CARD_FRAGMENT = gql`
  fragment ProductCardFragment on Product {
    id
    handle 
    title
    productType
    vendor
    description(truncateAt: 120)
    descriptionHtml
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
    metafields(first: 250) {
      edges {
        node {
          description
          value
          valueType
        }
      }
    }
    variants(first: 250) {
      edges {
        node {
          available
          availableForSale
          priceV2{ amount, currencyCode }
          id
          sku
          title
        }
      }
    }
  }
`

export default ProductCard
