import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

import { COLLECTIONS_QUERY } from '../components/Collection/Collection'

let apolloClient

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_SHOPIFY_API_URL,
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'X-Shopify-Storefront-Access-Token': 
          process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN,
      },
    }),
    cache: new InMemoryCache(),
  })
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // initialState is passed from any server side apollo requests
  // which we can use to hydrate the client :) 
  if (initialState) {
    // Get existing cache
    const existingCache = _apolloClient.extract()
    // Restore the cache using the data passed from getStaticProps / 
    // getServerSideProps combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState })
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient

  // Create the Apollo Client only if it doesn't already exist on FE
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

// This is a quick and diry fix for the fact that the next / apollo example
// misunderstands how useMemo works, the cache was being rebuilt on every route 
// change so you would see flashes of stale data when data has been overwritten 
// in the cache at some later point in the user journey. 

// This is becuse useMemo only does a shallow comparison. Doing a deep compare  
// would not be very performant. This is a rushed, but working solution.
// We only want to hydrate the store it if initialState changes.

// Revisit this before production as there is surely a more elegant solution
let initializedState = []
export function useApollo(initialState) {
  if(initialState && !initializedState.includes(initialState.key)) {
    if (!(typeof window === 'undefined')) {
      initializedState = [...initializedState, initialState.key]
    }
    return initializeApollo(initialState.state)
  }
  return initializeApollo() 
}

// We want the data from these queries on all pages so we can do that here to
// avoid having to pass them down on every SSG / SSR page.
const DEFAULT_QUERIES = [{ query: COLLECTIONS_QUERY }]

// Custom function to be used with getStaticProps carries out gql queries
// passed in an array from server side, initializes the apollo client
// and returns props so we have the data cached and ready to be hydrated
export const initWithQueries = async queries => {
  const apolloClient = initializeApollo()

  for (const query of queries) await apolloClient.query(query)
  for (const query of DEFAULT_QUERIES) await apolloClient.query(query)

  return {
    props: {
      initialApolloState: {
        state: apolloClient.cache.extract(),
        key: Date.now()
      }
    },
    // Tells Next to automatically regenerate the static page
    // after every user request (max 1 per second) so that the 
    // data is never too stale, even between full builds
    revalidate: 1,
  }
} 

// Allows us to return the result of a GQL query server side 
// so that we can use the results in getStaticPaths to generate pages
export const queryForStaticPaths = async query => {
  const apolloClient = initializeApollo()
  return await apolloClient.query(query)
}