import Link from 'next/link'

import { initWithQueries } from '../lib/apolloClient'
import Collection, { COLLECTION_QUERY, COLLECTIONS_QUERY } from '../components/Collection'

const collectionHandle = 'frontpage'

const Home = () => {
  return (
    <div>
      <Collection handle={collectionHandle}/>
      <Link href="/newcollection"><a>New collection</a></Link>
    </div>
  )
}

export const getStaticProps = () => initWithQueries([
  {
    query: COLLECTION_QUERY, 
    variables: { handle: collectionHandle }
  },
  { query: COLLECTIONS_QUERY }
])

export default Home
