"use client";

import MovieScroll from "@/components/MovieScroll/MovieScroll";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Config from "@/config";
import { useGuestSession } from "@/providers/GuestSessionContext";
import { markAsFavorite } from "@/services/accounts/markAsFavorite";
import { getMovieById } from "@/services/movies/getMovieById";
import { getMovieImagesById } from "@/services/movies/getMovieImagesById";
import { getRecommendedMoviesById } from "@/services/movies/getRecommendedMoviesById";
import { IMovieBackdropDetail } from "@/types/MovieBackdropDetail";
import { IMovieDetail } from "@/types/MovieDetail";
import { IMovieRecommendation } from "@/types/MovieRecommendation";
import clsx from "clsx";
import { Heart } from "lucide-react";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


const inter = Inter({ weight: ["400", "600", "700", "800"], subsets: ["latin"], preload: true })


const StarSVG = () => {
    return (
        <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0" />
            <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
            />
            <g id="SVGRepo_iconCarrier">
            <path
            d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612
            14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757
            7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682
            21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096
            14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306
            17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115
            13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248
            11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515
            21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341
            5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801
            13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856
            6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555
            6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z"
            fill="#eab308"
            />
            </g>
        </svg>
    )
}


const MovieDetailPage = () => {
    const { id } = useParams(); // id is a string | string[] | undefined
    const [movie, setMovie] = useState<IMovieDetail>();
    const [movieImages, setMovieImages] = useState<IMovieBackdropDetail>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [favorite, setFavorite] = useState<boolean>(false); 

    const [movieRecommendations, setMovieRecommendations] = useState<IMovieRecommendation[]>([]);

    const { guestSessionId } = useGuestSession();

    useEffect(() => {
        if (!id || typeof id !== "string") return;

        const fetchMovie = async () => {
            setLoading(true);
            try {
                const movie_data = await getMovieById(id);
                const img_data = await getMovieImagesById(id);
                const recommended_movie_data = await getRecommendedMoviesById(id);

                setMovie(movie_data);
                setMovieImages(img_data.backdrops[0]);
                setMovieRecommendations(recommended_movie_data.results);

                const storedFavorites = localStorage.getItem("favoriteMovieIds");
                const favoriteIds: number[] = storedFavorites ? JSON.parse(storedFavorites) : [];

                setFavorite(favoriteIds.includes(Number(id)));

                if (localStorage.getItem(String(movie_data.id))) {
                    setFavorite(true);
                }
            } catch (err) {
                console.error("Error fetching movie", err);
                setError("Could not load movie.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [id]);


    const onClickFavorite = async () => {
        if (!guestSessionId || !movie) return;

        const newFavoriteState = !favorite;

        try {
            await markAsFavorite(movie.id, newFavoriteState, guestSessionId);
            setFavorite(newFavoriteState);

            const storedFavorites = localStorage.getItem("favoriteMovieIds");
            const favoriteIds: number[] = storedFavorites ? JSON.parse(storedFavorites) : [];

            const updatedFavorites = newFavoriteState ? [...new Set([...favoriteIds, movie.id])] : favoriteIds.filter((id) => id !== movie.id);

            localStorage.setItem(
                "favoriteMovieIds",
                JSON.stringify(updatedFavorites)
            );
        } catch (error) {
            console.error("Failed to update favorite:", error);
        }
    }


    if (loading) return <div>Loading movie...</div>;
    if (error) return <div>{error}</div>;
    if (!movie) return <div>No movie found.</div>;

    const posterPath = Config.IMAGE_SOURCE_ALT + movieImages?.file_path;
    const budgetString = movie.budget.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    return (
        <div className="p-4 pb-0">
            {/* TODO: Add more movie details here. */}

            <div id="movie-backdrop" 
                 style={{ 
                    backgroundImage: `linear-gradient(to right, rgba(0,0,0, 1.0), rgba(0,0,0,0.6), rgba(0,0,0,1.0)),
                    url("${posterPath}")`, backgroundSize: "contain", backgroundPositionX: "center" }}
                 className="grid bg-black bg-no-repeat relative w-full h-110 p-8 pt-0 items-end mb-8 shadow-lg rounded-2xl">
                {/*<Image
                    src={posterPath}
                    alt={""}
                    fill
                    objectFit="contain"
                    className="w-full z-0 opacity-20"
                />*/}
                <div className="flex flex-row flex-wrap items-end">
                    <div className="z-10">
                        <div className="flex flex-row items-center gap-4">
                            <h1 className="text-5xl text-white inline font-bold">{movie.title}</h1>
                            <p className="text-2xl text-gray-400 pt-2">({new Date(movie.release_date).getFullYear()})</p>
                        </div>
                        <p className="text-lg text-gray-500 text-wrap mt-2">{movie.tagline}</p>
                    </div>
                    <div className="grow"></div>
                    <div className="flex flex-row text-white items-center text-xl gap-2 pt-4 z-10">
                        <StarSVG />
                        <span className="mr-4">
                            {movie.vote_average.toFixed(1)}/10
                        </span>
                        <Tooltip>
                            <TooltipTrigger>
                                <Heart className="hover:animate-bounce" color="#ff0f3f" { ... (favorite) && { fill: "#ff0f3f" } } onClick={() => onClickFavorite()} />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-white">
                                    { favorite ? "Remove from favorites" : "Add to favorites" }
                                </p>
                            </TooltipContent>
                        </Tooltip>
                        <Link className="ml-4 text-lg justify-center hover:underline" href={`https://www.imdb.com/title/${movie.imdb_id}/`}>Go to IMDB page</Link>
                    </div>
                </div>
            </div>
            <div id="movie-details"
                 className="grid grid-cols-2 gap-10">
                <div className="flex flex-col gap-4 border-2 p-6 rounded-2xl">
                    <h3 className={clsx("text-4xl text-black font-bold", inter.className)}>Overview</h3>
                    <p className="text-gray-700">{movie.overview}</p>
                    <p><span className="font-semibold">Budget:</span> {movie.budget >= 0.01 ? budgetString + " USD" : "Información no disponible"}</p>
                    { movie.homepage && (
                            <p><span className="font-semibold">Website:</span> <a href={movie.homepage} target="_blank" className="hover:underline">{movie.homepage}</a></p>       
                        )
                    }
                    <p><b className="font-semibold">Runtime: </b>{movie.runtime} mins</p>
                    <p><b className="font-semibold">Status: </b>{movie.status}</p>
                    <p><b className="font-semibold">Release date: </b>{new Date(movie.release_date).toLocaleDateString()}</p>
                    <h4 className={clsx("text-2xl text-black font-semibold", inter.className)}>Languages</h4>
                    <ul>
                        {
                            movie.spoken_languages.map((language, index) => {
                                return (
                                    <li key={index}> {language.english_name} </li>
                                )
                            })
                        }
                    </ul>
                    <h4 className={clsx("text-2xl text-black font-semibold", inter.className)}>Production Countries</h4>
                    <ul>
                        {
                            movie.production_countries.map((country, index) => {
                                return (
                                    <li key={index}> {country.name} </li>
                                )
                            })
                        }
                    </ul>
                    <div>
                        <h3 className={clsx("text-3xl text-black font-semibold mb-4", inter.className)}>Genres</h3>
                        <div className="flex flex-row flex-wrap gap-2">
                            {
                            movie.genres.map((value, i) => (
                                <Badge className="bg-stone-800 px-4 py-2 text-sm font-semibold" key={i} variant={"default"}>{value.name}</Badge>
                            ))
                            }
                        </div>
                    </div>
                </div>
                <div className="grid ml-auto gap-10 h-fit p-6 border-2 rounded-2xl">
                    <h3 className={clsx("font-bold text-3xl", inter.className)}>Production</h3>
                    {
                        movie.production_companies
                            .slice(0, 3)
                            .map((company, index) => {
                            return (
                                <div className="grid grid-cols-2 items-center mb-2 gap-8 h-fit" key={index}>
                                    <div className="grid w-full text-center justify-center">
                                        <Image 
                                            src={Config.IMAGE_SOURCE_ORIGINAL + company.logo_path}
                                            width={200}
                                            height={0}
                                            alt={""}
                                            className="border-0 object-contain text-xs h-20"
                                        />
                                    </div>
                                    <p className={clsx("font-medium text-xl justify-center text-left center", inter.className)}>{company.name}</p>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="col-span-2 p-6 border-2 rounded-2xl">
                    <MovieScroll title={"Peliculas recomendadas"} category="" movies={movieRecommendations} />
                </div>
            </div>
     </div>
    )
}

export default MovieDetailPage;