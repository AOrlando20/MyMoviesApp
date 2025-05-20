"use client";

import MovieScroll from "@/components/MovieScroll/MovieScroll";
import Config from "@/config";
import { getNowPlayingMovies } from "@/services/movies/getNowPlayingMovies";
import { getPopularMovies } from "@/services/movies/getPopularMovies";
import { getTopRatedMovies } from "@/services/movies/getTopRatedMovies";
import { IMovieDetail } from "@/types/MovieDetail";
import { useEffect, useState } from "react";

export default function Home() {
  const [nowPlayingMovies, setNowPlayingMovies] = useState<IMovieDetail[]>([]);
  const [popularMovies, setPopularMovies] = useState<IMovieDetail[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<IMovieDetail[]>([]);

  const [moviesFetched, setMoviesFetched] = useState<boolean>(false);
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
        setMoviesFetched(true);
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
      <div 
        style={{ 
          backgroundImage: `linear-gradient(to right, #000000FF, #1e1a4FF, #1e1a4dFF), url(${
          moviesFetched ? Config.IMAGE_SOURCE_ALT + nowPlayingMovies[0].backdrop_path : ""
          })`, 
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPositionY: "30%" }}
        className="relative text-white bg-gradient-to-r from-indigo-950 to-indigo-900 p-10 h-70"
      >
        <div className="z-10 text-lg h-fit">
          <p className="text-5xl font-bold">Welcome!</p>
          <p className="text-lg">
            <br/> Explore the movies of your choice. All in one app. <br/>
          </p> 
        </div>
      </div>

      <div className="p-6">
        <MovieScroll title="Now playing" category="now-playing" movies={nowPlayingMovies}/>
      </div>
      <div className="p-6">
        <MovieScroll title="Popular" category="popular" movies={popularMovies}/>
      </div>
      <div className="p-6">
        <MovieScroll title="Top rated" category="top-rated" movies={topRatedMovies} />
      </div>
    </div>
  );
}
