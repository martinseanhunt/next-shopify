import { gql } from '@apollo/client'

export const PRODUCT_FRAGMENT = gql`
  fragment ProductFragment on Product {
    id
    handle 
    title
    productType
    vendor
    description(truncateAt: 120)
    descriptionHtml
    images(first: 250) {
      edges {
        node {
          originalSrc
          altText
          transformedSrc(maxWidth: 245)
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
