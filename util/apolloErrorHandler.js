const apolloErrorHandler = e => {
  // TODO: dispatch an action which will enable us to shop common user
  // errors to the user. 
  console.warn('Oops, something went wrong:', e.message)
}

export default apolloErrorHandler
