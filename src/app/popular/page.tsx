'use client';
// src/app/popular/page.tsx

import React, { Suspense, useEffect, useRef, useState } from "react";
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
  const page = useRef<number>(1);
  const maxBound = useRef<number>(500);
  
  const searchParams = useSearchParams();
  if (searchParams.has("page")) {
      const pages = Number(searchParams.get("page"));

      if (pages <= 0) {
        page.current = 0;
      } else if (pages <= maxBound.current) {
        page.current = Number(searchParams.get("page"));
      } else {
        page.current = maxBound.current;
      }
  }

  useEffect(() => {
    const fetchPopularMovies = async () => {
      setLoading(true);
      try {
        const data = await getPopularMovies(page.current);
        setMovies(data.results);
        console.log(data);
      } catch (err) {
        console.error("Error loading movies: ", err);
      }
      setLoading(false);
    };

    fetchPopularMovies();
  }, []);

  return (
    <div className="p-6 h-full overflow-y-scroll">
      <h3 className={clsx(inter.className,
                          'text-3xl font-bold text-black mb-8'
                          )}>Popular Movies</h3>
      <h4 className={clsx(
                          inter.className,
                          'text-xl font-medium text-slate-600'
                          )}>Page: {page.current}</h4>

      {loading && <h5 className="text-lg text-gray-500">Cargando...</h5>}
      
      <PaginationMovies lowerBound={1} upperBound={maxBound.current} currentValue={page.current} />

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