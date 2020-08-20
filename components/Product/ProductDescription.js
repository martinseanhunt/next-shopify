import styled from 'styled-components'

const ProductDescription = ({ html }) => (
  <>
    <DescriptionLabel>Description:</DescriptionLabel>
    <HtmlDescription 
      dangerouslySetInnerHTML={{ __html: html}}
    />
  </>
)

const DescriptionLabel = styled.span`${({ theme }) => `
  color: ${theme.colors.medDarkGrey};
  font-weight: ${theme.fonts.weights.medium};
  display: block;
  margin-bottom: 5px;
`}`

const HtmlDescription = styled.div`${({ theme }) => `
  font-size: ${theme.fonts.m.fontSize};
  line-height: ${theme.fonts.m.lineHeight};
  max-width: 580px; 

  p {
    margin-bottom: 20px;
  }
`}`

export default ProductDescription
