"use client";

import MovieList from '@/components/MovieList/MovieList';
import PaginationMovies from '@/components/PaginationMovies/PaginationMovies';
import { getNowPlayingMovies } from '@/services/movies/getNowPlayingMovies';
import { IMovieDetail } from '@/types/MovieDetail';
import clsx from 'clsx';
import { Inter } from 'next/font/google';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'


const inter = Inter({ weight: ["400", "800"], subsets: ["latin"], preload: true })


const NowPlayingPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [movies, setMovies] = useState<IMovieDetail[]>([]);
  const page = useRef<number>(1);
  const maxPages = useRef<number>(259);

  const searchParams = useSearchParams();
  if (searchParams.has("page")) {
      const pages = Number(searchParams.get("page"));

      if (pages <= 0) {
        page.current = 0;
      } else if (pages <= maxPages.current) {
        page.current = Number(searchParams.get("page"));
      } else {
        page.current = maxPages.current;
      }
  }

  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      setLoading(true);
      try {
        const data = await getNowPlayingMovies(page.current);
        maxPages.current = data.total_pages;
        setMovies(data.results);
      } catch (err) {
        console.error("Error loading movies", err);
      }
      setLoading(false);
    };

    fetchNowPlayingMovies();
  }, []);


  return (
    <div className='p-6'>
      <h3 className={clsx(
                          inter.className,
                          'text-3xl font-bold text-black mb-8'
                          )}>Now Playing Movies</h3>
      <h4 className={clsx(
                                inter.className,
                                'text-xl font-medium text-slate-600'
                                )}>Page: {page.current}</h4>

      { loading && (<div className="text-md text-gray-700 mb-6">Movies loading...</div>) }

      { !loading && (
        <>
          <PaginationMovies lowerBound={1} upperBound={maxPages.current} currentValue={page.current} />
          <MovieList movies={movies} />
        </>
      ) }
    </div>
  )
}

export default NowPlayingPage;
