'use client';
// src/app/popular/page.tsx

import React, { Suspense, useEffect, useState } from "react";
import { getPopularMovies } from "@/services/movies/getPopularMovies";
import { IMovieDetail } from "@/types/MovieDetail";
import MovieList from "@/components/MovieList/MovieList";
import clsx from "clsx";
import { Inter } from "next/font/google";
import { useSearchParams } from "next/navigation";
import PaginationMovies from "@/components/PaginationMovies/PaginationMovies";

const inter = Inter({ weight: ["400", "800"], subsets: ["latin"], preload: true })


const PopularClientPage = () => {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<IMovieDetail[]>([]);

  const [page, setPage] = useState<number>(1);
  const maxPages = 500;
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchPopularMovies = async () => {
      setLoading(true);
      try {
        let pageParam = Number(searchParams.get("page"));
        if (!pageParam || pageParam < 1) pageParam = 1;
        setPage(() => pageParam);

        const data = await getPopularMovies(pageParam);
        setMovies(data.results);
        console.log(data);
      } catch (err) {
        console.error("Error loading movies: ", err);
      }
      setLoading(false);
    };

    fetchPopularMovies();
  }, [searchParams]);

  return (
    <div className="p-6 h-full overflow-y-scroll">
      <h3 className={clsx(inter.className,
                          'text-3xl font-bold text-black mb-2'
                          )}>Popular Movies</h3>
      <h4 className={clsx(
                          inter.className,
                          'text-lg font-medium text-slate-600'
                          )}>Page: {page} of {maxPages}</h4>

      {loading && <h5 className="text-lg text-gray-500">Cargando...</h5>}
      
      <PaginationMovies lowerBound={1} upperBound={maxPages} currentValue={page} />

      <div className="overflow-y-scroll">
        <MovieList movies={movies} />
      </div>
    </div>
  );
};

export default function SuspensePopularPage() {
  return (
    <Suspense>
      <PopularClientPage />
    </Suspense>
  )
};