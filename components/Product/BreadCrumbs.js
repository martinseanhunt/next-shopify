import styled from 'styled-components'
import Link from 'next/link'

const BreadCrumbs = ({ collectionHandle, productTitle }) => (
  <>
    <Crumbs>
      <Link href="/"><a>Home</a></Link>
      {` / `}
      <Link href="/[collectionHandle]" as={`/${collectionHandle}`}>
        <a>{collectionHandle.replace('-', ' ')}</a>
      </Link>
      {` / `} 
      <b>{productTitle}</b>
    </Crumbs>
  </>
)

const Crumbs = styled.span`${({ theme }) => `
  display: block;
  color: ${theme.colors.medDarkGrey};
  font-size: ${theme.fonts.s.fontSize};
  font-weight: ${theme.fonts.weights.medium};
  padding-bottom: 20px;

  a:hover {
    text-decoration: underline;
  }

  b {
    font-weight: ${theme.fonts.weights.bold};
    color: ${theme.colors.darkGrey};
  }
`}`

export default BreadCrumbs
