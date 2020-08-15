import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'

import { COLLECTIONS_QUERY } from '../Collection'

const Navigation = ({ children }) => {
  const { data } = useQuery(COLLECTIONS_QUERY)
  const { query: { handle } } = useRouter()

  const collections = data && data.collections.edges

  return (
    <Content>
      <CatalogTitle>Catalog</CatalogTitle>
      <CollectionTitle>Collections</CollectionTitle>
      <Nav>
        {collections && collections
          .filter(({ node }) => node.handle !== 'featured')
          .map(({ node }) => (
            <Link key={node.handle} href={`/${node.handle}`}>
              <a className={node.handle === handle ? 'active' : undefined}>
                {node.title}
              </a>
            </Link>
          )
        )}
      </Nav>
    </Content>
  )
}

const Content = styled.section`
  padding: 0 16px;
  color: ${({ theme }) => theme.colors.white};
`

const CatalogTitle = styled.h4`${({ theme }) => `
  font-size: ${theme.fonts.l.fontSize};
  font-weight: ${theme.fonts.weights.bold};
  margin-top: 50px;
`}`

const CollectionTitle = styled.h5`${({ theme }) => `
  font-size: ${theme.fonts.m.fontSize};
  font-weight: ${theme.fonts.weights.bold};
  margin-top: 40px;
`}`

const Nav = styled.nav`${({ theme }) => `
  margin-top: 20px;
  a { 
    color: ${theme.colors.lightGrey};; 
    text-decoration: none;
    display: block;
    font-weight: ${theme.fonts.weights.medium};
    padding: 12px 0;

    &:hover, &.active { font-weight: ${theme.fonts.weights.bold} }
  }
`}`

export default Navigation
