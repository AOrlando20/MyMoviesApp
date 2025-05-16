import api from "../api";

export const getPopularMovies = async (page: number) => {
    const endpoint = `/movie/popular?language=en-US&page=${page}`;

    const result = await api.get(endpoint)
    return result.data;
}