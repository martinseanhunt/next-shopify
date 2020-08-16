import styled from 'styled-components'

const Hero = ({ title, description, background }) => (
  <Banner background={background}>
    <h2>{title}</h2>
    {description && <p>{description}</p>}
  </Banner>
)

const Banner = styled.section`${({ theme, background }) => `
  background-image: url(${background});
  background-size: cover;
  background-position: center;
  width: 100%; 
  height: 500px;
  display: flex; 
  flex-direction: column;
  align-items: center; 
  justify-content: center;
  color: ${theme.colors.white};
  position: relative; 
  padding: 30px;
  text-align: center;
  margin-bottom: 30px;

  &::before {
    position: absolute; 
    top: 0;
    left: 0;
    content: '';
    background: ${theme.colors.transparentBlack};
    width: 100%;
    height: 100%;
    display: block;
    z-index: 1;
  }

  h2, p { 
    position: relative; 
    z-index: 2;
  }

  h2 {
    font-size: ${theme.fonts.xl.fontSize};
    font-weight: ${theme.fonts.weights.medium};
  }

  p {
    font-size: ${theme.fonts.l.fontSize};
    line-height: ${theme.fonts.l.lineHeight};
    max-width: 700px;
    font-weight: ${theme.fonts.weights.regular};
    padding-top: 30px;
  }
`}`

export default Hero
