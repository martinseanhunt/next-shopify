import styled from 'styled-components'

const Logo = ({ light, adjustTop, size }) => {
  return (  
    <h1>
      <Image
        src={light 
          ? '/Goodery-Logo-white-01_170x@2x.webp' 
          : '/Goodery-Logo-01_170x@2x.webp'
        }
        alt="Goodery Logo"
        adjustTop={adjustTop}
        size={size}
      />
    </h1>
  ) 
}

const Image = styled.img`${({ adjustTop, size }) => `
  width: ${size ? size : 150}px;
  ${adjustTop && `
    position: relative;
    top: ${adjustTop}px;
  `}
`}`

export default Logo
