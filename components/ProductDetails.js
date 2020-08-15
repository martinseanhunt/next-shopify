import { useQuery, gql } from '@apollo/client'

import useRefetchQuery from '../hooks/useRefetchQuery'

const ProductDetails = ({ productHandle }) => {
  const { data, refetch } = useQuery(PRODUCT_BY_HANDLE_QUERY, { 
    variables: { handle: productHandle }
  })

  console.log(data)

  useRefetchQuery(refetch)

  const product = data && data.productByHandle

  if(!product) return <div>Product not found</div>

  return (
    <div>{product.title}</div>
  )
}

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

export const PRODUCT_BY_HANDLE_QUERY = gql`
  query ProductByHandle($handle: String!) { 
    productByHandle(handle: $handle) { 
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`

export default ProductDetails
