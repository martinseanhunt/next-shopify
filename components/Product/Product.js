import { useQuery, gql } from '@apollo/client'
import Head from 'next/head'

import apolloErrorHandler from '../../util/apolloErrorHandler'
import useRefetchQuery from '../../hooks/useRefetchQuery'

import BreadCrumbs from './BreadCrumbs'
import ProductDetails from './ProductDetails'

const Product = ({ productHandle, collectionHandle }) => {
  const { data, loading, refetch: refetchProduct } = useQuery(
    PRODUCT_BY_HANDLE_QUERY, 
      { 
      variables: { 
        ...PRODUCT_BY_HANDLE_DEFAULTS,
        handle: productHandle
      },
      onError: apolloErrorHandler
    }
  )

  useRefetchQuery(refetchProduct)

  const product = data && data.productByHandle  
  if(loading) return '...'
  if(!product) return <div>Product not found</div>

  return (
    <>
      <Head>
        <title>Goodery - {product.title}</title>
      </Head>
      <BreadCrumbs 
        collectionHandle={collectionHandle}
        productTitle={product.title}
      />
      <ProductDetails 
        product={product}
        productHandle={productHandle}
        refetchProduct={refetchProduct}
      />
    </>
  )
}

export const VARIANT_FRAGMENT = gql`
  fragment VariantFragment on ProductVariant {
    available
    availableForSale
    priceV2{ amount, currencyCode }
    id
    sku
    title
    image {
      originalSrc
      altText
      transformedSrc(maxWidth: 245)
    }
  }
`

export const PRODUCT_DETAILS_FRAGMENT = gql`
  fragment ProductDetailsFragment on Product {
    id
    handle 
    title
    productType
    vendor
    description(truncateAt: 120)
    descriptionHtml
    availableForSale
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
    options(first: 250) {
      id
      name
      values
    }
    variants(first: 250) {
      edges {
        node {
          ...VariantFragment
        }
      }
    }
    variantBySelectedOptions(selectedOptions: $selectedOptions) { 
      ...VariantFragment
    }
  }
  ${VARIANT_FRAGMENT}
`

export const PRODUCT_BY_HANDLE_QUERY = gql`
  query ProductByHandle(
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) { 
    productByHandle(handle: $handle) { 
      ...ProductDetailsFragment
    }
  }
  ${PRODUCT_DETAILS_FRAGMENT}
`

export const PRODUCT_BY_HANDLE_DEFAULTS = {
  selectedOptions: [{ name: '', value: '' }]
}

export default Product
