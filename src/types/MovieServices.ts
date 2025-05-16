import { IMovieDetail } from "./MovieDetail";

export interface IPopularMoviesResult {
    page: number;
    results: IMovieDetail[];
    total_pages: number;
    total_results: number;
}

export interface INowPlayingMoviesResult {
    dates: {
        maximum: Date;
        minimum: Date;
    };
    page: number;
    results: IMovieDetail[];
    total_pages: number;
    total_results: number;
}

export interface ITopRatedMoviesResult {
    page: number;
    results: IMovieDetail[];
    total_pages: number;
    total_results: number;
}