import api from "../api"

export const getNowPlayingMovies = async (page: number) => {
    const endpoint = `/movie/now_playing?language=en-US&page=${page}`

    const result = await api.get(endpoint);
    return result.data;
}