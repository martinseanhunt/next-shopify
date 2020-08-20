import { gql, useQuery } from '@apollo/client'
import styled from 'styled-components'
import Head from 'next/head'

import apolloErrorHandler from '../../util/apolloErrorHandler'
import useRefetchQuery from '../../hooks/useRefetchQuery'
import ProductCard, { PRODUCT_CARD_FRAGMENT } from './ProductCard'
import Hero from '../common/Hero'

const Collection = ({ handle }) => {
  // Because we're using SSG initially this data will come from the cache 
  // and no network request will be made.
  const { data, refetch } = useQuery(
    COLLECTION_QUERY, 
    { 
      variables: { handle },
      onError: apolloErrorHandler
    }
  )

  console.log(data)
  
  // Silently refetch the query after initial render so we show fresh data even
  // While a build is processing but not complete.
  useRefetchQuery(refetch)

  // How do we want to handle the small subset of users who will arrive at stale
  // data? We can either let them see the stale data unil they refresh the page 
  // or we can siltenly refetch the data client side on page render / route 
  // change(as above) and update it if it's changed, or we could periodically 
  // and silently poll for updates without waiting for route changes.
  
  // This would be a good discussion point as there are trade offs all around 
  // and we may want to use different solutions on a query by query basis. 

  const collection = data && data.collectionByHandle  

  if(!collection) return 'Collection not found'

  const products = collection && collection.products.edges

  // NOTE: Using shopify image transformations doesn't seem to hold image 
  // qaulity as well as I'd like. I also notice that loading images from shopify
  // appears to be the biggest performance bottleneck. Probably worth 
  // integrating with a dedicated media CDN like cloudinary in production.

  // This is an example where next API routes could be incredibly useful as we 
  // Can listen for updates to the images on shopify via webhooks, upload the
  // image to cloudinary and store the images in our own database (I wonder if
  // we'd need to even store this in a db anywhere or if we can do something 
  // clever with cloudinary here) for querying at SSG time. This means we there
  // would be no extra steps from an admin perspective when adding / editing 
  // products in the shopify admin. We'd get all the benefits of a proper image 
  // CDN with good transformations with none of the admin overhead. 

  return (
    <>
      <Head>
        <title>Goodery - {collection.title}</title>
      </Head>
      <CollectionSection>
        {collection.image && (
          <Hero 
            title={collection.title} 
            description={collection.description}
            background={collection.image.transformedSrc}  
          />
        )}

        <CollectionMeta>
          <h2><b>{products.length}</b> {collection.title}</h2>
          {/* TODO: Filters */}
          <span>for <b>people</b> and <b>the planet</b></span>
        </CollectionMeta>

        <ProductGrid>
          {products.length > 0 && products.map(({ node }) =>
            <ProductCard 
              collection={collection.handle}
              product={node} 
              key={node.handle} 
            />
          )}
        </ProductGrid>
      </CollectionSection>
    </>
  )
}

const CollectionSection = styled.section`
  margin-bottom: ${({ theme }) => theme.layout.verticalRythm}px;
`

const CollectionMeta = styled.section`${({ theme }) => `
  color: ${theme.colors.medDarkGrey};
  display: flex; 
  justify-content: space-between;
  padding-bottom: 20px;

  b {
    font-weight: ${theme.fonts.weights.bold};
    color: ${theme.colors.darkGrey}
  }

  h2 {
    font-size: ${theme.fonts.s.fontSize};
    font-weight: ${theme.fonts.weights.medium};
  }
`}`

const ProductGrid = styled.section`
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(245px, 1fr));
  column-gap: 30px;
  row-gap: 40px;
`

export const COLLECTION_QUERY = gql`
  query Collection($handle: String!) {
    collectionByHandle(handle: $handle){
      title
      handle
      description(truncateAt: 240)
      image { 
        transformedSrc(maxWidth: 1100) 
      }
      products(first: 250) {
        pageInfo { hasNextPage }
        edges { 
          node { 
            ...ProductCardFragment
          } 
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`

export const COLLECTIONS_QUERY = gql`
  query Colletions { 
    collections(first: 250) { 
      edges { 
        node { 
          title
          handle 
        } 
      }
    }
  }
`

export const COLLECTIONS_WITH_PRODUCT_HANDLES_QUERY = gql`
  query CollectionsWithProdIds {
    collections(first: 250) {
      edges {
        node {
          handle
          products(first: 250) {
            edges { 
              node { 
                handle
              } 
            }
          }
        }
      }
    }
  }
`

export default Collection
