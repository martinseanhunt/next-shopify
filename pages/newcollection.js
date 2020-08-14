import Link from 'next/link'

import { initWithQuery } from '../lib/apolloClient'
import Collection, { COLLECTION_QUERY } from '../components/Collection'

const collectionHandle = 'new-collection'

const NewCollection = () => {  
  return (
    <div>
      <Collection handle={collectionHandle}/>
      <Link href="/"><a>Home</a></Link>
    </div>
  )
}

export const getStaticProps = initWithQuery(COLLECTION_QUERY, { handle: collectionHandle })
export default NewCollection
