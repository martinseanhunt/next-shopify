import styled from 'styled-components'
import Link from 'next/link'

import Header from './Header'
import Logo from '../common/Logo'

const Layout = ({ children }) => {

  return (
    <>
      <TopBar>
        This is a technical demo. No live payments will be taken and no orders 
        will be fulfilled.
      </TopBar>
      <Container>
        <Header /> 
        <main>
          {children}
        </main>
        <Footer>
          <Link href="/">
            <a>
              <Logo 
                size={100}
                adjustTop={-9}
              />
            </a>
          </Link>
        </Footer>
      </Container>
    </>
  )
}

const TopBar = styled.div`${({ theme }) => `
  background: ${theme.colors.transparentBlack};
  color: ${theme.colors.white};
  padding: 5px ${theme.layout.gutters}px;
  text-align: center;
  font-size: ${theme.fonts.s.fontSize};
`}`

const Container = styled.div`${({ theme }) => `
  max-width: ${theme.layout.maxWidth + theme.layout.gutters}px;
  margin: 0 auto;
  padding: 0 ${theme.layout.gutters}px;
`}`

const Footer = styled.header`${({ theme }) => `
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  border-top : 1px solid ${theme.colors.medGrey}; 
  margin: ${theme.layout.verticalRythm * 2}px 0 60px 0;
  padding-top: ${theme.layout.verticalRythm}px;
`}`

export default Layout
