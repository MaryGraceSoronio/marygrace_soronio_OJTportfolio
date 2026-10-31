import { useEffect, useRef, useState } from 'react'

/**
 * ImageWithSkeleton: Network-resilient image loader featuring cyber-physical
 * shimmering skeleton states during slow network connectivity and smooth
 * 400ms crossfade entrance upon asset resolution.
 */
export default function ImageWithSkeleton({
  src,
  alt = '',
  className = '',
  containerClassName = '',
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
  fallbackText,
  aspectRatio = 'aspect-[16/10]',
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const imgRef = useRef(null)

  // Fast check: if the image is already cached and loaded by the browser, mark loaded immediately
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true)
    }
  }, [src])

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* 1. Shimmering Skeleton Placeholder */}
      {!loaded && !failed && (
        <div
          className={`absolute inset-0 z-10 flex flex-col items-center justify-center skeleton-shimmer transition-opacity duration-300 ${
            loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${aspectRatio}`}
          aria-hidden="true"
        >
          {/* Subtle Cyber-Physical Micro-Chip Watermark */}
          <div className="flex flex-col items-center gap-xs opacity-40">
            <svg
              className="h-8 w-8 text-accent-light animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <rect x="8" y="8" width="8" height="8" />
              <path d="M4 9H2M4 15H2M20 9h2M20 15h2M9 4V2M15 4V2M9 20v2M15 20v2" />
            </svg>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
              Loading Asset…
            </span>
          </div>
        </div>
      )}

      {/* 2. Error Fallback State */}
      {failed ? (
        <div
          className={`flex h-full w-full flex-col items-center justify-center p-md text-center bg-paper-3 ${aspectRatio}`}
        >
          <svg
            className="h-6 w-6 text-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span className="mt-xs font-mono text-xs text-muted">
            {fallbackText || alt || 'Asset Unavailable'}
          </span>
        </div>
      ) : (
        /* 3. Actual Image with Smooth 400ms Crossfade */
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding={decoding}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`${className} transition-all duration-400 ease-out ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
          }`}
        />
      )}
    </div>
  )
}
