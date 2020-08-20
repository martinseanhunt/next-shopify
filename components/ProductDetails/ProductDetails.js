import { useState } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import styled from 'styled-components'
import Link from 'next/link'
import Head from 'next/head'

import formatMoney from '../../util/formatMoney'
import { useCartContext } from '../../contexts/cart/CartContext'
import useRefetchQuery from '../../hooks/useRefetchQuery'
import { CREATE_CART_MUTATION, UPDATE_CART_MUTATION } from '../Cart/Cart'

import ProductImage from '../common/ProductImage'

// TODO: This whole component needs refactoring, prioritising speed over
// refinement at this point ;) 

// TODO: Handle state when we try to add more of somethin than is
// in stock to the cart

const ProductDetails = ({ productHandle, collectionHandle }) => {
  const { state, dispatch } = useCartContext()

  const { data, refetch } = useQuery(PRODUCT_BY_HANDLE_QUERY, { 
    variables: { 
      ...PRODUCT_BY_HANDLE_DEFAULTS,
      handle: productHandle
    }
  })

  useRefetchQuery(refetch)

  // We can't use the apollo loading state for this because we
  // only want to show the loading state when we've refetched from an 
  // option change rather than from a refetch happening from the above which
  // we want to be silent.
  const [loadingVariant, setLoadingVariant] = useState(false)

  const [createCart, { loading: createCartLoading }] = useMutation(
    CREATE_CART_MUTATION,
    { 
      onCompleted: data => 
        dispatch({ 
          type: 'CREATE_CART',
          payload: data.checkoutCreate.checkout 
        }) 
    }
  )

  const [updateCart, { loading: updateCartLoading }] = useMutation(
    UPDATE_CART_MUTATION,
    { 
      onCompleted: data => 
        dispatch({ 
          type: 'UPDATE_CART',
          payload: data.checkoutLineItemsReplace.checkout 
        }) 
    }
  )

  // TODO: Maybe pass down data from page level to avoid this
  const product = data && data.productByHandle
  const variants = product && product.variants.edges
  const selectedVariant = product && product.variantBySelectedOptions || variants && variants[0].node

  const [quantitySelected, setQuantitySelected] = useState(1)

  const [selectedOptions, setSelectedOptions] = useState(product && product.options
    .reduce((optionsMap, opt) => (
      { ...optionsMap, [opt.name]: opt.values[0] }
    ), {})
  )
  
  // TODO: This is bad
  const [selectedImage, setSelectedImage] = useState(
    selectedVariant && selectedVariant.image || product && product.images.edges[0] && product.images.edges[0].node.image
  )

  const onAddToCart = variant => {
    const { id, lineItems } = state
    const newItem = {
      quantity: quantitySelected,
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

  if(!product) return <div>Product not found</div>

  // We need to handle invalid variants e.g. if a particular combination of 
  // options doesn't exist in the shopify admin. This is an edge case but it's
  // still worth safeguarding against.
  const invalidVariant = !loadingVariant && !Object.values(selectedOptions)
    .every(option => selectedVariant.title.includes(option))

  return (
    <>
      <Head>
        <title>Goodery - {product.title}</title>
      </Head>
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
            // TODO: Clean this up. Use default image to start and then update
            // it in state when the variant changes.
            image={selectedImage}
            autoHeight
          />
          <SmallImages>
            {product.images.edges
              .filter(({ node }) => node.transformedSrc !== selectedImage.transformedSrc)
              .map(({ node }) => (
                <button 
                  key={node.transformedSrc}
                  onClick={() => setSelectedImage(node)}
                >
                  <img src={node.transformedSrc} alt={node.altText} />
                </button>
              ))
            }
          </SmallImages>
        </div>

        <ProductInfo>
          <Title>{product.title}</Title>

          <Price>
            {loadingVariant 
              // TODO: Proper loading state
              ? '...'
              : invalidVariant 
                ? `This option is currently unavailable`
                : (
                  <span>
                    {formatMoney(selectedVariant.priceV2)}
                    {!selectedVariant.available && ' (Out of stock)'}
                  </span>
                )     
            }
          </Price>
          
          <Options>
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

            <label htmlFor="quantity">Quantity: 
              <input 
                value={quantitySelected} 
                id="quantity" 
                type="number"
                min="1"
                onChange={e => setQuantitySelected(parseInt(e.target.value))}
              />
            </label>
          </Options>
          
          <Actions>
            <AddToCart 
              onClick={() => onAddToCart(selectedVariant)}
              disabled={createCartLoading || updateCartLoading || invalidVariant || !selectedVariant.available}
            >
              Add{createCartLoading || updateCartLoading && 'ing'} to cart
            </AddToCart>

            <CartNotification visible={state.notifyItemAdded}>
              Item added to cart 🙌🏼
            </CartNotification> 
          </Actions>

          {product.descriptionHtml && (
            <>
              <DescriptionLabel>Description:</DescriptionLabel>
              <HtmlDescription 
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml}}
              />
            </>
          )}
          
        </ProductInfo>
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
`}`

const SmallImages = styled.div`
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  grid-gap: 10px;
  margin-top: 10px;

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
const ProductInfo = styled.div`${({ theme }) => `
  padding: 10px 0;
`}`

const Title = styled.h2`${({ theme }) => `
  padding: 0 0 20px 0;
  font-size: ${theme.fonts.xl.fontSize};
  line-height: ${theme.fonts.xl.lineHeight};
  text-transform: capitalize;
`}`

const Price = styled.span`${({ theme }) => `
  display: block;
  padding: 0 0 40px 0;
  font-weight: ${theme.fonts.weights.bold};
  font-size: ${theme.fonts.l.fontSize};
  text-transform: capitalize;
`}`

const Options = styled.div`${({ theme }) => `
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(200px, 270px));
  grid-column-gap: 15px;
  grid-row-gap: 20px;
  margin-bottom: 25px;

  label {
    color: ${theme.colors.medDarkGrey};
    font-weight: ${theme.fonts.weights.medium};
  }

  select, input { 
    display: block; 
    width: 100%;
    padding: 7px;
    background: ${theme.colors.lightBeige};
    border: 1px solid ${theme.colors.beigeHighlight};
    border-radius: 5px;
    margin-top: 5px;
  }
`}`

const Actions = styled.div`
  position: relative;
`

const AddToCart = styled.button`${({ theme }) => `
  cursor: pointer;
  border: 1px solid ${theme.colors.medGrey};
  background: ${theme.colors.beigeHighlight};
  font-size: ${theme.fonts.m.fontSize};
  padding: 7px 40px;
  border-radius: 5px;
  margin-bottom: 35px;

  &:disabled {
    color: ${theme.colors.medDarkGrey};
    cursor: default;

    &:hover {
      transform: none;
    }
  }

  &:hover {
    transform: scale(1.01);
  }
`}`

const CartNotification = styled.div`${({ theme, visible }) => `
  font-size: ${theme.fonts.m.fontSize};
  background: ${theme.colors.lightBeige};
  border: 1px solid ${theme.colors.beigeHighlight};
  border-radius: 5px;
  padding: 9px;
  opacity: ${visible ? 1 : 0}; 
  visibility: ${visible ? 'visible' : 'hidden'}; 
  transform: scale(${visible ? 1 : 0.7});
  pointer-events: none;
  transition: all 0.2s;
  text-align: center;
  position: absolute;
  top: -1px;
  left 160px;
`}`

const DescriptionLabel = styled.span`${({ theme }) => `
  color: ${theme.colors.medDarkGrey};
  font-weight: ${theme.fonts.weights.medium};
  display: block;
  margin-bottom: 5px;
`}`

const HtmlDescription = styled.div`${({ theme }) => `
  font-size: ${theme.fonts.m.fontSize};
  line-height: ${theme.fonts.m.lineHeight};
  max-width: 580px; 

  p {
    margin-bottom: 20px;
  }
`}`

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

export default ProductDetails
