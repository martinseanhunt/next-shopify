import styled from 'styled-components'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons'

import Logo from '../common/Logo'
import Navigation from './Navigation'

// TODO: Refactor / compose

const Layout = ({ children }) => (
  <Container>
    <Header>
      <Link href="/">
        <a><Logo adjustTop={7} /></a>
      </Link>

      <Menu>
        <Navigation />
        <Cart>
          <FontAwesomeIcon 
            icon={faShoppingBasket} 
            title="Shopping Basket Icon"
          />
          <span>0</span>
        </Cart>
      </Menu>
    </Header>
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
)

const Container = styled.div`${({ theme }) => `
  max-width: ${theme.layout.maxWidth + theme.layout.gutters}px;
  margin: 0 auto;
  padding: 0 ${theme.layout.gutters}px;
`}`

const Header = styled.header`${({ theme }) => `
  padding: 40px 0 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom : 1px solid ${theme.colors.medGrey}; 
  margin-bottom: ${theme.layout.verticalRythm}px;
`}`

const Menu = styled.main`
  display: flex;
  align-items: center;
`

const Cart = styled.div`${({ theme }) => `
  font-size: ${theme.fonts.ml.fontSize};

  span {
    font-size: ${theme.fonts.m.fontSize};
    font-weight: ${theme.fonts.weights.medium};
    padding-left: 5px;
  }
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
