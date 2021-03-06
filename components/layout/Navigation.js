import { useQuery } from '@apollo/client'
import Link from 'next/link'
import styled from 'styled-components'

import apolloErrorHandler from '../../util/apolloErrorHandler'
import { COLLECTIONS_QUERY } from '../Collection/Collection'

const Navigation = ({ 
  mobile, 
  mobileOpen, 
  collectionHandle
}) => {
  const { data } = useQuery(COLLECTIONS_QUERY, { onError: apolloErrorHandler })
  const collections = data && data.collections.edges

  return (
    <>
      <Nav mobile={mobile} mobileOpen={mobileOpen}>
        {collections && collections
          .filter(({ node }) => node.handle !== 'featured')
          .map(({ node }) => (
            <Link 
              key={node.handle} 
              href='/[collectionHandle]'
              as={`/${node.handle}`}
            >
              <a className={node.handle === collectionHandle 
                ? 'active' 
                : undefined}
              >
                {node.title}
              </a>
            </Link>
          ))
        }
      </Nav>
    </>
  )
}

const Nav = styled.nav`${({ theme, mobile, mobileOpen }) => `
  ${mobile ? `
    display: block; 
    width: 100%;
    position: relative;
    top: -${theme.layout.verticalRythm}px;
    overflow: hidden;
    visability: hidden;
    height: 0;

    ${mobileOpen && `
      height: auto;
      visability: visable;
    `}
  ` : `
    margin-right: 20px;
    display: none;
    @media (min-width: ${theme.breakpoints.l}) {
      display: flex;
    }
  `}

  a { 
    text-decoration: none;
    display: block;
    font-size: ${theme.fonts.m.fontSize};

    ${mobile ? `
      border-bottom: 1px solid ${theme.colors.beigeHighlight};
      padding: 12px 5px;

      &:last-of-type {
        border-bottom: 1px solid ${theme.colors.medGrey};
      }
    ` : `
      background: ${theme.colors.transparentWhite};
      border: 1px solid ${theme.colors.beigeHighlight};
      border-radius: 20px;
      margin: 0 5px;
      padding: 8px 10px;
    `}

    &:hover, &.active { 
      background: ${theme.colors.lessTransparentWhite} ;
    }
  }
`}`

export default Navigation
