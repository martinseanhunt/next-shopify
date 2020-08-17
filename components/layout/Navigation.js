import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'

import { COLLECTIONS_QUERY } from '../Collection'

const Navigation = ({ children }) => {
  const { data } = useQuery(COLLECTIONS_QUERY)
  const { query: { collectionHandle } } = useRouter()

  const collections = data && data.collections.edges

  return (
    <Nav>
      {collections && collections
        .filter(({ node }) => node.handle !== 'featured')
        .map(({ node }) => (
          <Link 
            key={node.handle} 
            href='/[collectionHandle]'
            as={`/${node.handle}`}
          >
            <a className={node.handle === collectionHandle ? 'active' : undefined}>
              {node.title}
            </a>
          </Link>
        ))
      }
    </Nav>
  )
}

const Nav = styled.nav`${({ theme }) => `
  display: flex; 
  margin-right: 30px;

  a { 
    text-decoration: none;
    display: block;
    font-size: ${theme.fonts.m.fontSize};
    margin: 0 5px;
    padding: 8px 10px;
    background: ${theme.colors.transparentWhite};
    border: 1px solid ${theme.colors.beigeHighlight};
    border-radius: 20px;

    &:hover, &.active { 
      background: ${theme.colors.lessTransparentWhite} ;
    }
  }
`}`

export default Navigation
