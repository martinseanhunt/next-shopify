import { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'

import { useCartContext } from '../contexts/cart/CartContext'
import useRefetchQuery from '../hooks/useRefetchQuery'
import { CREATE_CART_MUTATION} from './Cart'

// TODO: This whole component needs refactoring, prioritising speed over
// refinement at this point ;) 

const ProductDetails = ({ productHandle, collectionHandle }) => {
  const { state, dispatch } = useCartContext()

  const { data, refetch } = useQuery(PRODUCT_BY_HANDLE_QUERY, { 
    variables: { 
      handle: productHandle,
      selectedOptions: [{ name: '', value: '' }]
    }
  })

  // TODO: move this
  const onCreateCart = data => {
    dispatch({ 
      type: 'CREATE_CART',
      payload: data.checkoutCreate.checkout 
    })
  }

  const [createCart, { loading: createCartLoading }] = useMutation(
    CREATE_CART_MUTATION,
    { onCompleted: onCreateCart }
  );

  // TODO: Can improve this by getting the variant with a lazyQuery and using the node()
  // query to do the product lookup

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

  const addToCart = (variant) => {
    if(state.id) {
      
    } else {
      createCart({
        variables: {
          input: { 
            lineItems: [{
              quantity: 1, // TODO
              variantId: variant.id
            }]
          }
        }
      })
    }
  }

  const onOptionChange = async ({ target: { name, value } }) => {
    const newState = {
      ...selectedOptions,
      [name]: value
    }

    setSelectedOptions(newState)
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

  // We need to handle invalid variants e.g. if a particular combination of 
  // options doesn't exist in the shopify admin. This is an edge case but it's
  // still worth safeguarding against. 
  const invalidVariant = !loadingVariant && !Object.values(selectedOptions)
    .every(option => selectedVariant.title.includes(option))

  return (
    <>
      {product.title}

      {loadingVariant 
        ? '...' // TODO: loading spinner
        : invalidVariant 
          ? `This option is currently unavailable`
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
    
      <button 
        onClick={() => addToCart(selectedVariant)}
        disabled={createCartLoading}
      >
        Add{createCartLoading && 'ing'} to cart
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
