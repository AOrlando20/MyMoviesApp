import api from "../api"

export const getSimilarMoviesById = async (id: string) => {
    const { data } = await api.get(`/movie/${id}/similar?language=en-US&page=1`);
    return data;
};