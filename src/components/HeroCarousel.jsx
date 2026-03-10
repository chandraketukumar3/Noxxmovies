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
                const [moviesRes, tvRes] = await Promise.all([
                    getBollywoodMovies(1),
                    getBollywoodTV(1)
                ]);

                const movies = moviesRes.data || [];
                const tvSeries = tvRes.data || [];

                // Combine and sort by popularity, take top 12
                const combined = [...movies, ...tvSeries]
                    .sort((a, b) => b.popularity - a.popularity)
                    .slice(0, 12);

                setItems(combined);
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
