import { useRef, useEffect } from 'react'

const useHandleClickOutside = callback => {
  const contentToCloseRef = useRef()
  const toggleButtonRef = useRef()

  useEffect(() => {
    const handleClick = e => contentToCloseRef.current 
      && !contentToCloseRef.current.contains(e.target)
      && !toggleButtonRef.current.contains(e.target)
      && callback()

    document.addEventListener('mousedown', handleClick)

    return () => document.removeEventListener('mousedown', handleClick)
  },[])

  return [contentToCloseRef, toggleButtonRef]
}

export default useHandleClickOutside
