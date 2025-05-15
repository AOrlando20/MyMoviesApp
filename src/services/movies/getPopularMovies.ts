import api from "../api";

export const getPopularMovies = async (page: number) => {
    let res: any;
    const endpoint = `/movie/popular?language=en-US&page=${page}`;

    await api.get(endpoint)
            .then((d) => {
                res = d.data;
            })
            .catch((err) => {
                res = err.response;
            });
    return res;
}