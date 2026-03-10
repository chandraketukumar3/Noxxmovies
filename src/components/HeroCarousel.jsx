import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { toggleFavorite } from '../redux/slices/favoritesSlice';
import { getBollywoodMovies, getBollywoodTV } from '../services/moviesService';
import HeroBanner from './HeroBanner';
import Loader from './Loader';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const favoriteIds = useSelector((state) =>
        new Set(state.favorites.items.map((m) => m.id))
    );

    useEffect(() => {
        const fetchCarouselData = async () => {
            try {
                // Fetch Bollywood, Trending Movies, and Trending TV
                const [bollyMoviesRes, bollyTVRes, trendingMoviesRes, trendingTVRes] = await Promise.all([
                    getBollywoodMovies(1),
                    getBollywoodTV(1),
                    getTrending(1), // trending movies
                    api.get('/movies/trending/tv', { params: { page: 1 } })
                ]);

                const allItems = [
                    ...(bollyMoviesRes.data || []),
                    ...(bollyTVRes.data || []),
                    ...(trendingMoviesRes.data || []),
                    ...(trendingTVRes.data || [])
                ];

                // Remove duplicates by ID
                const uniqueItems = Array.from(new Map(allItems.map(item => [item.id, item])).values());
                
                // Shuffle and take top 20 to check for trailers
                const candidates = uniqueItems
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 20);

                const itemsWithTrailers = [];

                // Fetch trailers for candidates
                for (const item of candidates) {
                    if (itemsWithTrailers.length >= 12) break;

                    try {
                        const type = item.first_air_date ? 'tv' : 'movie';
                        const trailerRes = await api.get(`/movies/${item.id}/trailer`, { params: { type } });
                        
                        if (trailerRes.data && trailerRes.data.key) {
                            itemsWithTrailers.push({
                                ...item,
                                trailerKey: trailerRes.data.key,
                                mediaType: type
                            });
                        }
                    } catch (e) {
                        console.error(`Failed to fetch trailer for ${item.id}`, e);
                    }
                }

                setItems(itemsWithTrailers);
            } catch (error) {
                console.error("Error fetching carousel data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCarouselData();
    }, []);

    const handleMoreInfo = (movie) => {
        navigate(`/movies/${movie.id}`);
    };

    const handleAddToFavorites = (movie) => {
        dispatch(toggleFavorite(movie));
    };

    const settings = {
        dots: true,
        infinite: items.length > 1,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 10000,
        cssEase: "linear",
        pauseOnHover: false,
        arrows: false,
        dotsClass: "slick-dots custom-dots"
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-[#0b0b0f]"><Loader /></div>;
    if (items.length === 0) return null;

    return (
        <div className="hero-carousel-wrapper relative">
            <Slider {...settings}>
                {items.map((item) => (
                    <div key={item.id}>
                        <HeroBanner 
                            movie={item} 
                            movieId={item.id}
                            isFavorited={favoriteIds.has(item.id)}
                            trailerKey={item.trailerKey}
                            mediaType={item.mediaType}
                            onMoreInfo={handleMoreInfo}
                            onAddToFavorites={handleAddToFavorites}
                        />
                    </div>
                ))}
            </Slider>
            <style jsx="true">{`
                .custom-dots {
                    bottom: 30px;
                }
                .custom-dots li button:before {
                    color: white;
                    font-size: 10px;
                    opacity: 0.5;
                }
                .custom-dots li.slick-active button:before {
                    color: white;
                    opacity: 1;
                }
            `}</style>
        </div>
    );
};

export default HeroCarousel;
