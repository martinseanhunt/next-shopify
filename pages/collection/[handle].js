import { useRouter } from 'next/router'

import { initWithQueries, queryForStaticPaths } from '../../lib/apolloClient'
import Collection, { COLLECTION_QUERY, COLLECTIONS_QUERY } from '../../components/Collection'

const CollectionPage = () => {
  const router = useRouter()
  const { handle } = router.query

  return <Collection handle={handle}/>
}

export const getStaticPaths = async () => {
  const res = await queryForStaticPaths({ query: COLLECTIONS_QUERY })
  const collections = res.data.collections.edges

  const paths = collections.map(({ node }) => ({
    params: { handle: node.handle },
  }))

  return { paths, fallback: true }
}

export const getStaticProps = ({ params }) => initWithQueries([
  {
    query: COLLECTION_QUERY, 
    variables: { handle: params.handle }
  }
])

export default CollectionPage
