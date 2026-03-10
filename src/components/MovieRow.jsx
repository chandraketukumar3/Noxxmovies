import { useState, useEffect } from 'react'
import Slider from 'react-slick'
import MovieCard from './MovieCard'
import SkeletonLoader from './SkeletonLoader'

// Import slick-carousel css
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MovieRow = ({
  title,
  movies = [],
  loading = false,
  onTrailerClick,
  onLoadMore, // Callback to fetch more from API
}) => {
  const [hasMore, setHasMore] = useState(true)

  // Carousel settings requested by user
  const settings = {
    infinite: movies.length > 6, // Only infinite if we have enough items
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 2,
    arrows: true,
    lazyLoad: "ondemand",
    beforeChange: (current, next) => {
      // If we are near the total length, trigger load more
      if (onLoadMore && next >= movies.length - 8 && !loading) {
        onLoadMore()
      }
    },
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 5 }
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2 }
      }
    ]
  }

  return (
    <section className="relative py-6" aria-label={title}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Row header */}
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-xl sm:text-2xl font-bold tracking-wide uppercase"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h2>
        </div>

        {/* Slider row */}
        {loading && movies.length === 0 ? (
          <SkeletonLoader count={7} />
        ) : movies.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            No content available.
          </p>
        ) : (
          <div className="movie-carousel-container relative">
            <Slider {...settings}>
              {movies.map((movie, index) => (
                <div
                  key={`${movie.id}-${index}`}
                  className="px-2 outline-none"
                >
                  <MovieCard movie={movie} onTrailerClick={onTrailerClick} />
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
      
      {/* Custom Styles for Slider Arrows */}
      <style>{`
        .slick-prev, .slick-next {
          z-index: 20;
          width: 40px;
          height: 40px;
          background: rgba(0,0,0,0.5) !important;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        .slick-prev:hover, .slick-next:hover {
          background: var(--primary) !important;
          transform: scale(1.1);
        }
        .slick-prev { left: -20px; }
        .slick-next { right: -20px; }
        .slick-prev:before, .slick-next:before {
          font-family: 'slick';
          font-size: 24px;
        }
        .movie-carousel-container .slick-list {
          overflow: visible;
          padding: 10px 0;
        }
        .movie-carousel-container .slick-track {
          display: flex !important;
        }
      `}</style>
    </section>
  )
}

export default MovieRow
