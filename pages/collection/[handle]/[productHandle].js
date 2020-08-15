import { useRouter } from 'next/router'

import { initWithQueries, queryForStaticPaths } from '../../../lib/apolloClient'
import { COLLECTIONS_WITH_PRODUCT_HANDLES_QUERY } from '../../../components/Collection'
import ProductDetails, { PRODUCT_BY_HANDLE_QUERY } from '../../../components/ProductDetails'

const Product = () => {
  const router = useRouter()
  const { 
    handle: collectionHandle, 
    productHandle 
  } = router.query

  return <ProductDetails 
    collectionHandle={collectionHandle}
    productHandle={productHandle}
  />
}

export const getStaticPaths = async () => {
  const res = await queryForStaticPaths({ 
    query: COLLECTIONS_WITH_PRODUCT_HANDLES_QUERY,
  })
  const collections = res.data.collections.edges

  const paths = collections.reduce((acc, { node: collection }) => [
    ...acc,
    ...collection.products.edges.map(({ node: product }) => ({
      params: {
        handle: collection.handle,
        productHandle: product.handle
      }
    }))
  ], [])

  return { paths, fallback: true }
}

export const getStaticProps = ({ params }) => initWithQueries([
  {
    query: PRODUCT_BY_HANDLE_QUERY, 
    variables: { handle: params.productHandle }
  }
])

export default Product
