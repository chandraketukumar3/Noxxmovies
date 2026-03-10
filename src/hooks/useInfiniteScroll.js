import { useEffect, useRef, useCallback } from 'react'

/**
 * Attaches an IntersectionObserver to a sentinel element.
 * Calls `onIntersect` when the sentinel enters the viewport.
 *
 * @param {Function} onIntersect - Called when the end of the list is visible
 * @param {boolean} hasMore - When false the observer is disconnected
 * @param {boolean} loading - Pauses observation while a fetch is in progress
 * @returns {{ sentinelRef }} - Attach sentinelRef to the sentinel div at list end
 */
const useInfiniteScroll = (onIntersect, hasMore, loading) => {
  const sentinelRef = useRef(null)
  const observerRef = useRef(null)

  const stableCallback = useCallback(onIntersect, [onIntersect])

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    if (!hasMore || loading) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          stableCallback()
        }
      },
      { rootMargin: '200px', threshold: 0 }
    )

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, loading, stableCallback])

  return { sentinelRef }
}

export default useInfiniteScroll
