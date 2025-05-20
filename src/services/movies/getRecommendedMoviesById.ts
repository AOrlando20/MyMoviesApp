import api from "../api"

export const getRecommendedMoviesById = async (id: string) => {
    const { data } = await api.get(`/movie/${id}/recommendations?language=en-US&page=1`);
    return data;
};