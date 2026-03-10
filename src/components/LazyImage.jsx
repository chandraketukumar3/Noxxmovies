import { useState, useRef, useEffect } from 'react'

const FALLBACK = 'https://via.placeholder.com/300x450/1A1A24/A1A1AA?text=No+Image'

/**
 * Image that lazy-loads via IntersectionObserver and fades in on load.
 * Falls back to a placeholder on error.
 */
const LazyImage = ({ src, alt, className = '', style = {}, fallback = FALLBACK }) => {
  const [imgSrc, setImgSrc] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)
  const observerRef = useRef(null)

  useEffect(() => {
    const el = imgRef.current
    if (!el) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setImgSrc(src || fallback)
          observerRef.current?.disconnect()
        }
      },
      { rootMargin: '300px', threshold: 0 }
    )
    observerRef.current.observe(el)

    return () => observerRef.current?.disconnect()
  }, [src, fallback])

  return (
    <img
      ref={imgRef}
      src={imgSrc || undefined}
      alt={alt}
      className={`img-lazy ${loaded ? 'loaded' : ''} ${className}`}
      style={style}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => { setImgSrc(fallback); setLoaded(true) }}
    />
  )
}

export default LazyImage
