import { useEffect } from 'react'

// TODO: Probably a beter way to go about this

const useRefetchQuery = (refetch) => {
  // We always want to trigger a silent refetch after the initial render.
  // This way we know the data is up to date for the current user.
  useEffect(() => { 
    // We need to try / catch this because in a development environment
    // refetch doesn't work properly on hot reload and so the app crashes.
    // There are some issue with apollo and hot reload in general that would
    // need to be adressed with more time available
    try { 
      refetch() 
    } catch { 
      console.warn('Refetch is not successful after hot reloads')
    }
  }, [])
}

export default useRefetchQuery
