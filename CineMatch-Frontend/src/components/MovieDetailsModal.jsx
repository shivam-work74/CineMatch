import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Calendar, Star, Clock } from 'lucide-react';
import api from '../lib/api';

const MovieDetailsModal = ({ show, movieId, onClose }) => {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show && movieId) {
            const fetchDetails = async () => {
                setLoading(true);
                try {
                    const response = await api.get(`/movies/${movieId}`);
                    setMovie(response.data);
                } catch (error) {
                    console.error("Failed to fetch movie details", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        } else {
            setMovie(null);
        }
    }, [show, movieId]);

    if (!show) return null;

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl ring-1 ring-white/10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-white/20"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        {loading ? (
                            <div className="flex h-96 items-center justify-center">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                            </div>
                        ) : movie ? (
                            <div className="flex flex-col md:flex-row">
                                {/* Trailer / Image Section */}
                                <div className="relative h-64 w-full bg-black md:h-auto md:w-2/5 lg:w-1/2">
                                    {movie.trailerKey ? (
                                        <iframe
                                            className="h-full w-full"
                                            src={`https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1&mute=0`}
                                            title="Movie Trailer"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                                            alt={movie.title}
                                            className="h-full w-full object-cover opacity-80"
                                        />
                                    )}
                                </div>

                                {/* Details Section */}
                                <div className="flex flex-col p-6 md:w-3/5 lg:w-1/2">
                                    <h2 className="mb-2 text-3xl font-bold text-white">{movie.title}</h2>

                                    <div className="mb-4 flex flex-wrap gap-4 text-sm text-zinc-400">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {movie.release_date?.split('-')[0]}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-yellow-500" />
                                            {movie.vote_average?.toFixed(1)}
                                        </div>
                                        {movie.runtime && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {movie.runtime} min
                                            </div>
                                        )}
                                    </div>

                                    <p className="mb-6 flex-grow text-zinc-300 leading-relaxed">
                                        {movie.overview}
                                    </p>

                                    {/* Genres */}
                                    <div className="flex flex-wrap gap-2">
                                        {movie.genres?.map((g) => (
                                            <span key={g.id} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                                                {g.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-zinc-400">Failed to load details.</div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MovieDetailsModal;
