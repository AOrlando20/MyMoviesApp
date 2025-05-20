"use client"

import MovieList from "@/components/MovieList/MovieList";
import PaginationMovies from "@/components/PaginationMovies/PaginationMovies";
import { useGuestSession } from "@/providers/GuestSessionContext";
import { getFavoriteMovies } from "@/services/accounts/getFavoriteMovies";
import { IMovieDetail } from "@/types/MovieDetail";
import clsx from "clsx";

import { Inter } from "next/font/google";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const inter = Inter({ weight: ["400", "600", "700", "800"], subsets: ["latin"], preload: true })

const MyFavoritesPage = () => {
    const { guestSessionId } = useGuestSession();
    const [loading, setLoading] = useState<boolean>(false);

    const [movies, setMovies] = useState<IMovieDetail[]>([]);

    const [page, setPage] = useState<number>(1);
    const [maxPages, setMaxPages] = useState<number>(1);

    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!guestSessionId) return;

            setLoading(true);

            try {
                let pageParam = Number(searchParams.get("page"));
                if (!pageParam || pageParam < 1) pageParam = 1;
                setPage(() => pageParam);

                const data = await getFavoriteMovies(guestSessionId, pageParam);
                setMaxPages(data?.total_pages || 1);
                setMovies(data?.results || []);
            } catch (err) {
                console.error("Error loading favorite movies:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchFavorites();
    }, [guestSessionId, searchParams]);

    return (
    <div className="p-6">
        <h3 className={`text-3xl font-bold mb-2 ${inter.className}`}>My Favorite Movies</h3>
        <h4 className={clsx(inter.className,
                            'text-lg font-medium text-slate-600'
                            )}>Page: {page}</h4>

        {loading && (
            <h5 className="text-lg text-gray-500">Loading favorite movies...</h5>
        )}

        {(!loading && movies.length === 0) && (
            <div className="text-center mt-10 text-gray-600">
                <p className="text-xl">You don&apos;t have any favorite movies yet.</p>
                <p className="text-sm mt-2">
                    Go to a movie&apos;s detail page and click &quot;Add to Favorites&quot; to see it here.
                </p>
            </div>
        )}

        {!loading && movies.length > 0 && (
            <>
                <PaginationMovies lowerBound={1} upperBound={maxPages} currentValue={page} />
                <MovieList movies={movies} />
            </>)}
    </div>)
}

export default function SuspenseMyFavoritesPage() {
    return (
        <Suspense>
            <MyFavoritesPage />
        </Suspense>
    )
};

// rafce