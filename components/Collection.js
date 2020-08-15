import { gql, useQuery } from '@apollo/client'

import useRefetchQuery from '../hooks/useRefetchQuery'

const Collection = ({ handle }) => {
  // Because we're using SSG initially this data will come from the cache 
  // and no network request will be made.
  const { data, loading, refetch } = useQuery(
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

  // TODO: Loading and 404
  if(!collection) return loading
    ? <div>Loading...</div>
    : <div>Collection not found</div>

  const products = collection && collection.products.edges

  return (
    <div>
      <h2>{collection.title}</h2>
      {products.length ? products.map(({ node }) => (
        <div key={node.id}>
          <h3>{node.title}</h3>
          <strong>{node.variants.edges[0].node.priceV2.amount}</strong>
        </div>
      )) : null}
    </div>
  )
}

// TODO tidy up query. Also Do I want to split out product and collection? 
export const COLLECTION_QUERY = gql`
  query collection($handle: String!) {
    collectionByHandle(handle: $handle){
      title,
      image { originalSrc },
      products(first: 250) {
        pageInfo { hasNextPage }
        edges { 
          node { 
            id
            handle 
            title
            description
            descriptionHtml
            images(first: 250) {
              edges {
                node {
                  originalSrc
                }
              }
            }
            priceRange {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            variants(first: 250) {
              edges {
                node {
                  availableForSale
                  priceV2{ amount, currencyCode }
                  id
                  sku
                  title
                }
              }
            }
          } 
        }
      }
    }
  }
`

export const COLLECTIONS_QUERY = gql`
  query colletions { 
    collections(first: 250) { 
      edges { node { 
        title
        handle 
      } }
    }
  }
`

export default Collection


