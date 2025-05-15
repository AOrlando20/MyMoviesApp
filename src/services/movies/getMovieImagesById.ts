import api from "../api"

export const getMovieImagesById = async (id: string) => {
    const { data } = await api.get(`/movie/${id}/images`);
    return data;
};