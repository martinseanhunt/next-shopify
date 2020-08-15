import styled from 'styled-components'

import Logo from '../common/Logo'
import Navigation from './Navigation'

const Layout = ({ children }) => (
  <Container>
    <Sidebar>
      <Logo light/>
      <Navigation />
    </Sidebar>
    <Main>
      {children}
    </Main>
  </Container>
)

const Container = styled.div`
  width: 100%; 
  min-height: 100vh;
  display: grid;
  grid-template-columns: 300px 1fr;
`

const Sidebar = styled.header`
  background: ${({ theme }) => theme.colors.darkGrey};
  padding: 30px 20px;
`

const Main = styled.main`
  background: ${({ theme }) => theme.colors.gooderyBeige};
`

export default Layout
