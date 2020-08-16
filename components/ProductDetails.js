import { useState } from 'react'
import { useQuery, useLazyQuery, gql } from '@apollo/client'

import useRefetchQuery from '../hooks/useRefetchQuery'

const ProductDetails = ({ productHandle, collectionHandle }) => {
  const { data, refetch } = useQuery(PRODUCT_BY_HANDLE_QUERY, { 
    variables: { 
      handle: productHandle,
      selectedOptions: [{ name: '', value: '' }]
    }
  })

  // We can't use the apollo loading state for this because we don't 
  // only want to show the loading state when we've refetched from an 
  // option change.
  const [loadingVariant, setLoadingVariant] = useState(false)

  useRefetchQuery(refetch)

  const product = data && data.productByHandle
  if(!product) return <div>Product not found</div>

  const [selectedOptions, setSelectedOptions] = useState(product.options.reduce((optionsMap, opt) => (
    { ...optionsMap, [opt.name]: opt.values[0]  }
  ), {}))

  const addToCart = () => {
  }

  const onOptionChange = async ({ target: { name, value } }) => {
    const newState = {
      ...selectedOptions,
      [name]: value
    }
    
    setLoadingVariant(true)
    // Get the associated variant from shopify and update selected variant in state
    await refetch({ 
      handle: productHandle,
      selectedOptions: Object.keys(newState)
        .map(key => ({ name: key, value: newState[key]}))
    })
    setLoadingVariant(false)
  }

  const variants = product.variants.edges
  const selectedVariant = product.variantBySelectedOptions || variants[0].node

  return (
    <>
      {product.title}

      {loadingVariant 
        ? '...' // TODO: loading spinner
        : `£${selectedVariant.priceV2.amount}`
      }
      
      {variants.length > 1 && product.options.map(({ name, values }) => (
        <label htmlFor={name} key={name}>{name}: 
          <select 
            name={name} 
            id={name} 
            value={selectedOptions[name]}
            onChange={onOptionChange}
          >
            {values.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </label>
      ))}
    
      <button onClick={addToCart}>
        Add to card
      </button>
    </>
  )
}

const VARIANT_FRAGMENT = gql`
  fragment VariantFragment on ProductVariant {
    available
    availableForSale
    priceV2{ amount, currencyCode }
    id
    sku
    title
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

export default ProductDetails
