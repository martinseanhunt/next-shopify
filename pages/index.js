import Link from 'next/link'

import { initWithQuery } from '../lib/apolloClient'
import Collection, { COLLECTION_QUERY } from '../components/Collection'

const collectionHandle = 'frontpage'

const Home = () => {
  return (
    <div>
      <Collection handle={collectionHandle}/>
      <Link href="/newcollection"><a>New collection</a></Link>
    </div>
  )
}

export const getStaticProps = initWithQuery(COLLECTION_QUERY, { handle: collectionHandle })
export default Home
