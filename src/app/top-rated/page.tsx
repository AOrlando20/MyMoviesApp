"use client";

import MovieList from '@/components/MovieList/MovieList';
import { getTopRatedMovies } from '@/services/movies/getTopRatedMovies';
import { IMovieDetail } from '@/types/MovieDetail';
import React, { Suspense, useEffect, useState } from 'react'

import { Inter } from 'next/font/google';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import PaginationMovies from '@/components/PaginationMovies/PaginationMovies';


const inter = Inter({ weight: ["400", "800"], subsets: ["latin"], preload: true })


const TopRatedPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [movies, setMovies] = useState<IMovieDetail[]>([]);

  const [page, setPage] = useState<number>(1);
  const maxPages = 500;

  const searchParams = useSearchParams();
  
  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      setLoading(true);
      try {
        let pageParam = Number(searchParams.get("page"));
        if (!pageParam || pageParam < 1) pageParam = 1;
        setPage(() => pageParam);

        const data = await getTopRatedMovies(pageParam);
        setMovies(data.results);
      } catch (err) {
        console.error("Error loading movies", err);
      }
      setLoading(false);
    };

    fetchNowPlayingMovies();
  }, [searchParams]);


  return (
    <div className='p-6'>
      <h3 className={clsx(
                    inter.className,
                    'text-3xl font-bold text-black mb-2'
                    )}>Top Rated Movies</h3>
      <h4 className={clsx(
                                inter.className,
                                'text-lg font-medium text-slate-600'
                                )}>Page: {page} of {maxPages}</h4>

      { loading && (<div className="text-md text-gray-700 mb-6">Movies loading...</div>) }

      <PaginationMovies lowerBound={1} upperBound={maxPages} currentValue={page} />

      <MovieList movies={movies} />
    </div>
  )
}

export default function SuspenseTopRatedPage() {
    return (
      <Suspense>
        <TopRatedPage/>
      </Suspense>
    )
};