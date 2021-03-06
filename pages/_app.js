import Head from 'next/head'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../lib/apolloClient'
import { ThemeProvider } from 'styled-components'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import theme from '../styles/theme'
import GlobalStyle from '../styles/GlobalStyle'

import CartContextProvider from '../contexts/cart/CartContext'
import Layout from '../components/layout/Layout'


const MyApp = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps.initialApolloState)

  return (
    <>
      <Head>
        <title>Goodery - food for people and the planet</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <ApolloProvider client={apolloClient}>
          <CartContextProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </CartContextProvider>
        </ApolloProvider>
      </ThemeProvider>
    </>
  )  
}

export default MyApp
