"use client";

import MovieList from "@/components/MovieList/MovieList";
import { getNowPlayingMovies } from "@/services/movies/getNowPlayingMovies";
import { getPopularMovies } from "@/services/movies/getPopularMovies";
import { getTopRatedMovies } from "@/services/movies/getTopRatedMovies";
import { IMovieDetail } from "@/types/MovieDetail";
import { useEffect, useState } from "react";

export default function Home() {
  const [nowPlayingMovies, setNowPlayingMovies] = useState<IMovieDetail[]>([]);
  const [popularMovies, setPopularMovies] = useState<IMovieDetail[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<IMovieDetail[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {

    setLoading(true);

    const fetchMovies = async () => {

      try {
        const nowPlayingData = await getNowPlayingMovies(1);
        const popularData = await getPopularMovies(1);
        const topRatedData = await getTopRatedMovies(1);

        setNowPlayingMovies(nowPlayingData.results);
        setPopularMovies(popularData.results);
        setTopRatedMovies(topRatedData.results);
      } catch (err) {
        console.error("Error loading movies:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [])

  if (loading) return (
    <div><h3 className="text-xl font-semibold">Cargando...</h3></div>
  )

  return (
    <div>
      <h1 className="text-5xl font-bold mb-5">Home</h1>
      <h3 className="text-3xl font-semibold my-5">Now Playing Movies</h3>
      <MovieList movies={nowPlayingMovies.slice(0, 5)} />
      <h3 className="text-3xl font-semibold my-5">Popular Movies</h3>
      <MovieList movies={popularMovies.slice(0, 5)} />
      <h3 className="text-3xl font-semibold my-5">Top rated Movies</h3>
      <MovieList movies={topRatedMovies.slice(0, 5)} />
    </div>
  );
}
