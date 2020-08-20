import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Use this hook to trigger a silent refetch after the initial render of a given
// component and whenever the path changes (i.e. subsequent visits to the same 
// page). This way we know the data is up to date for the current user.
const useRefetchQuery = refetch => {
  const { asPath } = useRouter()

  useEffect(() => { 
    // Call refetch after initial render so that data is not stale
    // When waiting for rebuild of SSG pages
    try {
      refetch() 
    } catch {
      // This is a known issue with latest nexjts & apollo
      // https://github.com/apollographql/apollo-client/issues/5870
      console.log('refetching does not currently work on hot reload')
    }
  }, [asPath])
}

export default useRefetchQuery
