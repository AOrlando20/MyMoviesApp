"use client"

import MovieList from "@/components/MovieList/MovieList";
import { useGuestSession } from "@/providers/GuestSessionContext";
import { getFavoriteMovies } from "@/services/accounts/getFavoriteMovies";
import { IMovieDetail } from "@/types/MovieDetail";

import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ weight: ["400", "600", "700", "800"], subsets: ["latin"], preload: true })

const MyFavoritesPage = () => {
    const { guestSessionId } = useGuestSession();
    const [loading, setLoading] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [movies, setMovies] = useState<IMovieDetail[]>([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!guestSessionId) return;

            setLoading(true);

            try {
                const data = await getFavoriteMovies(guestSessionId);
                setMovies(data?.results || []);
            } catch (err) {
                console.error("Error loading favorite movies:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchFavorites();
    }, [guestSessionId])

    return (
    <div>
        <h3 className={`text-3xl font-bold mb-6 ${inter.className}`}>My Favorite Movies</h3>

        {
            loading && (
                <h5 className="text-lg text-gray-500">Loading favorites...</h5>
            )
        }

        {!loading && movies.length === 0 && (
            <div className="text-center mt-10 text-gray-600">
                <p className="text-xl">You don&apos;t have any favorite movies yet.</p>
                <p className="text-sm mt-2">
                    Go to a movie&apos;s detail page and click &quot;Add to Favorites&quot; to see it here.
                </p>
            </div>
        )}

        {!loading && movies.length > 0 && <MovieList movies={movies} />}
    </div>)
}

export default MyFavoritesPage;

// rafce