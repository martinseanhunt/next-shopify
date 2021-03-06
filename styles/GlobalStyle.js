import { createGlobalStyle } from 'styled-components'

// TODO: Some of the styles in various components have lots in common with 
// other styles across the application. Recompose some of them in to single 
// reusuble componentsin /components/common which can be imported and extended
// as needed. 

const reset = `
  /* http://meyerweb.com/eric/tools/css/reset/ 
  v2.0 | 20110126
  License: none (public domain)
  */

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
  display: block;
  }
  body {
  line-height: 1;
  }
  ol, ul {
  list-style: none;
  }
  blockquote, q {
  quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
  content: '';
  content: none;
  }
  table {
  border-collapse: collapse;
  border-spacing: 0;
  }

`

const GlobalStyle = createGlobalStyle`${({ theme }) => `
  ${reset}
  
  *, *:before, *:after {
    box-sizing: border-box;
  }

  html { font-size: ${theme.fonts.base.fontSize}; }

  body {
    font-family: ${theme.fonts.base.fontFamily};
    font-weight: ${theme.fonts.weights.regular};
    font-size: ${theme.fonts.s.fontSize};
    background: ${theme.colors.gooderyBeige};
    color: ${theme.colors.darkGrey};
  }

  select, button {
    color: ${theme.colors.darkGrey};
    font-family: ${theme.fonts.base.fontFamily};
    font-weight: ${theme.fonts.weights.regular};
  }

  b, strong { font-weight: ${theme.fonts.weights.bold} }

  a { 
    color: inherit;
    text-decoration: inherit;
  }
`}`


export default GlobalStyle
