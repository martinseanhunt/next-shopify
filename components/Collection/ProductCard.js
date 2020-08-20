import { gql } from '@apollo/client'
import styled from 'styled-components'
import Link from 'next/link'

import ProductImage from '../common/ProductImage'
import formatMoney from '../../util/formatMoney'

const ProductCard = ({ product, collection }) => {  
  const { 
    images,
    priceRange: { minVariantPrice, maxVariantPrice },
    title,
    description,
    availableForSale
  } = product

  const image = images.edges.length && images.edges[0].node
  
  const price = minVariantPrice.amount === maxVariantPrice.amount
    ? `${formatMoney(minVariantPrice)}`
    : `${formatMoney(minVariantPrice)} - ${formatMoney(maxVariantPrice)}`

  return (
    <Link 
      href={'/[collectionHandle]/[productHandle]'}
      as={`/${collection}/${product.handle}`}
    >
      <a>
        <Product>
          <ProductImage 
            image={image} 
            showOutOfStock={!availableForSale}  
          />
          <h3>{title}</h3>
          <strong>{price}</strong>
          <span>{description}</span>
        </Product>
     </a>
    </Link>
  )
}

const Product = styled.div`${({ theme }) => `
  h3 {
    padding: 15px 0 8px 0;
    font-weight: ${theme.fonts.weights.bold};
    font-size: ${theme.fonts.m.fontSize};
    text-transform: capitalize;
  }

  strong { 
    font-size: ${theme.fonts.s.fontSize};
    font-weight: ${theme.fonts.weights.bold};
    display: block;
    padding-bottom: 15px;
  }

  span {
    color: ${theme.colors.medDarkGrey};
    font-weight: ${theme.fonts.weights.medium};
    font-size: ${theme.fonts.base.fontSize};
    line-height: ${theme.fonts.s.lineHeight};
  }
`}`

export const PRODUCT_CARD_FRAGMENT = gql`
  fragment ProductCardFragment on Product {
    availableForSale
    handle 
    title
    description(truncateAt: 108)
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
