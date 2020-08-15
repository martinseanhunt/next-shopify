import Link from 'next/link'

import { initWithQueries } from '../lib/apolloClient'
import Collection, { COLLECTION_QUERY } from '../components/Collection'

const collectionHandle = 'frontpage'

const Home = () => {
  return <Collection handle={collectionHandle}/>
}

export const getStaticProps = () => initWithQueries([
  {
    query: COLLECTION_QUERY, 
    variables: { handle: collectionHandle }
  }
])

export default Home
