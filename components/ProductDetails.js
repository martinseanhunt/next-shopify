import { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import styled from 'styled-components'
import Link from 'next/link'

import { useCartContext } from '../contexts/cart/CartContext'
import useRefetchQuery from '../hooks/useRefetchQuery'
import { CREATE_CART_MUTATION, UPDATE_CART_MUTATION } from './Cart'

import ProductImage from './ProductImage'

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

  // TODO: Handle state when we try to add more ofo somethin than is
  // in stock to the cart

  const [createCart, { loading: createCartLoading }] = useMutation(
    CREATE_CART_MUTATION,
    { onCompleted: data => 
      dispatch({ 
        type: 'CREATE_CART',
        payload: data.checkoutCreate.checkout 
      }) 
    }
  )

  const [updateCart, { loading: updateCartLoading }] = useMutation(
    UPDATE_CART_MUTATION,
    { onCompleted: data => 
      dispatch({ 
        type: 'UPDATE_CART',
        payload: data.checkoutLineItemsReplace.checkout 
      }) 
    }
  )

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
    { ...optionsMap, [opt.name]: opt.values[0] }
  ), {}))

  const addToCart = variant => {
    const { id, lineItems } = state
    const newItem = {
      quantity: 1, // TODO
      variantId: variant.id
    }

    if(id) {
      const newLineItems = lineItems.edges.map(({ node }) => ({
        variantId: node.variant.id,
        quantity: newItem.variantId === node.variant.id 
          ? node.quantity + newItem.quantity
          : node.quantity
      }))

      updateCart({
        variables: {
          checkoutId: id,
          lineItems: newLineItems
            .some(({ variantId }) => variantId === newItem.variantId)
              ? newLineItems
              : [...newLineItems, newItem]
        }
      })
    } else {
      createCart({
        variables: {
          input: { 
            lineItems: [newItem]
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
    <BreadCrumbs>
      <Link href="/"><a>Home</a></Link>
      {` / `}
      <Link href="/[collectionHandle]" as={`/${collectionHandle}`}><a>{collectionHandle.replace('-', ' ')}</a></Link>
      {` / `} 
      <b>{product.title}</b>
    </BreadCrumbs>
    
    <ProductGrid>
      <div>
        <ProductImage 
          // TODO: what if this variant isn't for sale but others are
          availableForSale={selectedVariant.availableForSale} 
          image={selectedVariant.image || product.images[0].node.image}
          autoHeight
        />
        <SmallImages>
          {product.images.edges.map(({ node }) => (
            <button>
              <img src={node.transformedSrc} alt={node.altText} />
            </button>
          ))}
        </SmallImages>
      </div>

      <div>
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
          disabled={createCartLoading || updateCartLoading}
        >
          Add{createCartLoading || updateCartLoading && 'ing'} to cart
        </button>
      </div>
    </ProductGrid>
    </>
  )
}

const BreadCrumbs = styled.span`${({ theme }) => `
  display: block;
  color: ${theme.colors.medDarkGrey};
  font-size: ${theme.fonts.s.fontSize};
  font-weight: ${theme.fonts.weights.medium};
  padding-bottom: 20px;

  a:hover {
    text-decoration: underline;
  }

  b {
    font-weight: ${theme.fonts.weights.bold};
    color: ${theme.colors.darkGrey}
  }
`}`

const ProductGrid = styled.div`${({ theme }) => `
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 30px;

  div:first-child {
    grid-column: 1 / -1;
  }

  div:last-child {
    grid-column: 1 / -1;
  }

  @media (min-width: ${theme.breakpoints.s}) {
    div:first-child {
      grid-column: span 6;
    }

    div:last-child {
      grid-column: span 6;
    }
  }

  @media (min-width: ${theme.breakpoints.m}) {
    div:first-child {
      grid-column: span 5;
    }

    div:last-child {
      grid-column: span 7;
    }
  }

  img { 
    border: 5px ${theme.colors.white} solid;
  }
`}`

const SmallImages = styled.div`
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  grid-gap: 10px;
  margin-top: 20px;

  button {
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    cursor: pointer;
  }

  img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover;
    height: 120px;
  }
`

const VARIANT_FRAGMENT = gql`
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

export default ProductDetails
