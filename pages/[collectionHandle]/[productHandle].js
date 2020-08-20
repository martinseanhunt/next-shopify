import { useRouter } from 'next/router'

import { initWithQueries, queryForStaticPaths } from '../../lib/apolloClient'
import { 
  COLLECTIONS_WITH_PRODUCT_HANDLES_QUERY 
} from '../../components/Collection/Collection'
import Product, { 
  PRODUCT_BY_HANDLE_QUERY, 
  PRODUCT_BY_HANDLE_DEFAULTS 
} from '../../components/Product/Product'

const ProductPage = () => {
  const router = useRouter()
  const { 
    collectionHandle, 
    productHandle 
  } = router.query

  return <Product 
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
        collectionHandle: collection.handle,
        productHandle: product.handle
      }
    }))
  ], [])

  return { paths, fallback: true }
}

export const getStaticProps = ({ params }) => initWithQueries([
  {
    query: PRODUCT_BY_HANDLE_QUERY, 
    variables: { 
      ...PRODUCT_BY_HANDLE_DEFAULTS,
      handle: params.productHandle
    }
  }
])

export default ProductPage
