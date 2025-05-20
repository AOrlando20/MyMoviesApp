import { IMovieDetail } from "@/types/MovieDetail";
import SmallMovieCard from "../SmallMovieCard/SmallMovieCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import Link from "next/link";
import { IMovieRecommendation } from "@/types/MovieRecommendation";

interface MovieScrollProps {
    title: string;
    category: string;
    movies: IMovieDetail[] | IMovieRecommendation[];
};

const MovieScroll = ({ title = "", category = "", movies = [] } : MovieScrollProps) => {
    return (
        <div>
            <h3 className="text-3xl font-semibold">{title}</h3>
            <div className="p-16 pt-6 pb-0">
                <Carousel>
                    <CarouselContent className="-ml-10">
                        {
                            movies.map((movie) => {
                                return (
                                    <CarouselItem key={movie.id} className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-10">
                                        <Link
                                            href={{
                                                pathname: `/movie/${movie.id}`,
                                                query: { from: category }
                                            }} 
                                        >
                                            <SmallMovieCard movie={movie}/>
                                        </Link>
                                    </CarouselItem>
                                )
                            })
                        }
                    </CarouselContent>
                    <CarouselPrevious/>
                    <CarouselNext/>
                </Carousel>
            </div>
        </div>
    )
}

export default MovieScroll; 