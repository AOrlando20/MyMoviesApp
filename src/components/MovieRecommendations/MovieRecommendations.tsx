import Link from "next/link";
import MovieCard from "../MovieCard/MovieCard";
import { IMovieRecommendation } from "@/types/MovieRecommendation";

type IMovieRecommendationList = {
    movies: IMovieRecommendation[]
}

const MovieRecommendations: React.FC<IMovieRecommendationList> = ({ movies }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={{
              pathname: `/movie/${movie.id}`,
              query: { from: "popular" }
            }}
          >
            <MovieCard
              title={movie.title}
              voteAverage={movie.vote_average}
              description={movie.overview}
              posterPath={movie.poster_path}
              releaseYear={new Date(movie.release_date).getFullYear()}
            />
          </Link>
        ))}
      </div>
    )
}

export default MovieRecommendations;