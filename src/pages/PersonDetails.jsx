import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import MovieCard from '../components/MovieCard';

const PersonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [movieCredits, setMovieCredits] = useState([]);
    const [tvCredits, setTvCredits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPersonData = async () => {
            setLoading(true);
            try {
                // We use our existing backend endpoints if they support person detail, 
                // but usually we might need to add specific ones. 
                // For now, I'll assume we might need to call TMDB directly or add backend routes.
                // Given the instructions, I should ensure backend returns results.
                
                // Let's assume we have endpoints for these or we use the unified search/detail logic.
                // Since I can't easily add many new backend routes without checking index.js, 
                // I'll try to use a combined fetch if possible or add routes to movieRoutes.js.
                
                // Actually, I'll just add the routes to movieRoutes.js first to be safe.
                const [personRes, movieRes, tvRes] = await Promise.all([
                    api.get(`/movies/person/${id}`),
                    api.get(`/movies/person/${id}/movie_credits`),
                    api.get(`/movies/person/${id}/tv_credits`)
                ]);

                setPerson(personRes.data);
                // Top 10 movies
                setMovieCredits((movieRes.data || [])
                    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                    .slice(0, 10));
                // Top 10 TV shows
                setTvCredits((tvRes.data || [])
                    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                    .slice(0, 10));

            } catch (error) {
                console.error("Error fetching person details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPersonData();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0b0b0f]"><Loader /></div>;
    if (!person) return <div className="min-h-screen flex items-center justify-center text-white">Person not found.</div>;

    return (
        <div className="min-h-screen py-10" style={{ background: 'var(--bg)' }}>
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <button 
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-sm font-medium hover:text-[var(--primary)] transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>

                <div className="flex flex-col md:flex-row gap-10">
                    {/* Left Side: Profile Image */}
                    <div className="w-full md:w-1/3 lg:w-1/4">
                        <div className="rounded-2xl overflow-hidden shadow-2xl border border-[var(--border)]">
                            <img 
                                src={person.profile_path ? `https://image.tmdb.org/t/p/h632${person.profile_path}` : 'https://via.placeholder.com/500x750?text=No+Image'} 
                                alt={person.name}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                        <div className="mt-6 space-y-4">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">Known For</h3>
                                <p className="text-white mt-1">{person.known_for_department || 'N/A'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">Popularity</h3>
                                <p className="text-white mt-1">{person.popularity?.toFixed(1) || '0.0'}</p>
                            </div>
                            {person.birthday && (
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">Birthday</h3>
                                    <p className="text-white mt-1">{person.birthday}</p>
                                </div>
                            )}
                            {person.place_of_birth && (
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">Place of Birth</h3>
                                    <p className="text-white mt-1">{person.place_of_birth}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Bio and Credits */}
                    <div className="flex-1">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white">{person.name}</h1>
                        
                        <div className="mb-10">
                            <h2 className="text-xl font-bold mb-4 text-white">Biography</h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed text-sm sm:text-base">
                                {person.biography || `We don't have a biography for ${person.name} yet.`}
                            </p>
                        </div>

                        {/* Top Movies */}
                        {movieCredits.length > 0 && (
                            <div className="mb-10">
                                <h2 className="text-xl font-bold mb-6 text-white">Top Movies</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {movieCredits.map(movie => (
                                        <MovieCard key={movie.id} movie={movie} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Top TV Shows */}
                        {tvCredits.length > 0 && (
                            <div className="mb-10">
                                <h2 className="text-xl font-bold mb-6 text-white">Top TV Shows</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {tvCredits.map(tv => (
                                        <MovieCard key={tv.id} movie={tv} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonDetails;
