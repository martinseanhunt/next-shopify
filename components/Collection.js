import { gql, useQuery } from '@apollo/client'
import styled from 'styled-components'

import useRefetchQuery from '../hooks/useRefetchQuery'
import ProductCard, { PRODUCT_CARD_FRAGMENT } from './ProductCard'
import Hero from './Hero'

const Collection = ({ handle }) => {
  // Because we're using SSG initially this data will come from the cache 
  // and no network request will be made.
  const { data, refetch } = useQuery(
    COLLECTION_QUERY, 
    { variables: { handle } }
  )
  
  // Silently refetch the query after initial render so we show fresh data even in between builds
  // We may not actually want to use this here but I'm laying the groundwork to be able to make 
  // sure inventory data is always up to date.
  useRefetchQuery(refetch)

  // The big UX decision here and with a statically generated ecommerce platform in general is...
  // how do we want to handle the small subset of users who will arrive at stale data? 
  // We can either let them see the stale data unil they refresh the page so their experience is maximally
  // smooth but has the potential to be out of date, Or we can siltenly refetch the data client side (as above)
  // and update it if it's changed. If using the above strategy would it be worth faking a very quick loading
  // state once new data has arrived which would stop the user having the impression of the data suddenly changing on them.
  // This would be a good discussion point as there are trade offs all around and we may want to use different 
  // solutions on a case by case basis. Actually... I could make new items fade in with a css trainsition... TODO

  const collection = data && data.collectionByHandle  

  if(!collection) return <div>Collection not found</div>

  const products = collection && collection.products.edges

  // NOTE: Using shopify image transformations doesn't seem to hold image qaulity as well as I'd like. 
  // In production would think of another solutionbecause it's not good enough. 

  return (
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
        transformedSrc(maxWidth: 1200) 
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
