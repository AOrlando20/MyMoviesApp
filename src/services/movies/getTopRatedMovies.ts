import api from "../api"

export const getTopRatedMovies = async (page: number) => {
    const endpoint = `/movie/top_rated?language=en-US&page=${page}`;

    const result = await api.get(endpoint)
    return result.data;
}