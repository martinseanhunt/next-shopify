import { useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import useHandleClickOutside from '../../hooks/useHandleClickOutside'

import Logo from '../common/Logo'
import Navigation from './Navigation'
import Cart from '../Cart'

// TODO: Refactor / compose

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileNavRef, mobileNavToggleRef] = useHandleClickOutside(
    () => setMobileOpen(false)
  )

  return (
    <Container>
      <Header>
        <Link href="/">
          <a><Logo adjustTop={7} /></a>
        </Link>

        <Menu>
          <MobileNavToggle 
            onClick={() => setMobileOpen(!mobileOpen)}
            ref={mobileNavToggleRef}
          >
            <FontAwesomeIcon icon={faBars} />
          </MobileNavToggle>
          <Navigation />
          <Cart />
        </Menu>
      </Header>
      <MobileNav ref={mobileNavRef}>
        <Navigation mobileOpen={mobileOpen} mobile/>
      </MobileNav>
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
}

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
  position: relative;
`}`

const Menu = styled.main`${({ theme }) => `
  display: flex;
  align-items: center;
  position: relative;
  top: -7px;

  @media (min-width: ${theme.breakpoints.l}) {
    position: static;
  }
`}`

const MobileNavToggle = styled.button`${({ theme }) => `
  border: none;
  padding: 0;
  background: none;
  margin-right: 20px;
  cursor: pointer;
  outline: none;
  font-size: ${theme.fonts.ml.fontSize};
  
  @media (min-width: ${theme.breakpoints.l}) {
    display: none;
  }
`}`

const MobileNav = styled.div`${({ theme }) => `
  @media (min-width: ${theme.breakpoints.l}) {
    display: none;
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
