import styled from 'styled-components'

const Logo = ({ light }) => {
  return (  
    <h1><Image src={`/Goodery-Logo-${light && 'white-'}01_170x@2x.webp`} alt="Goodery Logo" /></h1>
  ) 
}

const Image = styled.img`
  width: 150px;
`

export default Logo
