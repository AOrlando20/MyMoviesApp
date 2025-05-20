"use client";

import MovieList from '@/components/MovieList/MovieList';
import PaginationMovies from '@/components/PaginationMovies/PaginationMovies';
import { getNowPlayingMovies } from '@/services/movies/getNowPlayingMovies';
import { IMovieDetail } from '@/types/MovieDetail';
import clsx from 'clsx';
import { Inter } from 'next/font/google';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useRef, useState } from 'react'


const inter = Inter({ weight: ["400", "800"], subsets: ["latin"], preload: true })


const NowPlayingPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [movies, setMovies] = useState<IMovieDetail[]>([]);

  const [page, setPage] = useState<number>(1);
  const maxPages = useRef<number>(259);

  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      setLoading(true);
      try {
        let pageParam = Number(searchParams.get("page"));
        if (!pageParam || pageParam < 1) pageParam = 1;
        setPage(() => pageParam);

        const data = await getNowPlayingMovies(pageParam);
        maxPages.current = data.total_pages;
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
                          )}>Now Playing Movies</h3>
      <h4 className={clsx(
                                inter.className,
                                'text-lg font-medium text-slate-600'
                                )}>Page: {page} of {maxPages.current}</h4>

      { loading && (<div className="text-md text-gray-700 mb-6">Movies loading...</div>) }

      { !loading && (
        <>
          <PaginationMovies lowerBound={1} upperBound={maxPages.current} currentValue={page} />
          <MovieList movies={movies} />
        </>
      ) }
    </div>
  )
}

export default function SuspenseNowPlaying() {
  return (
    <Suspense>
      <NowPlayingPage />
    </Suspense>
  )
};
