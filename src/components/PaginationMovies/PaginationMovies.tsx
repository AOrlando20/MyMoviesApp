import { Pagination, 
    PaginationContent, 
    PaginationEllipsis, 
    PaginationItem, 
    PaginationLink, 
    PaginationNext, 
    PaginationPrevious } from "../ui/pagination";


interface PaginationMoviesProps {
    lowerBound: number;
    upperBound: number;
    currentValue: number;
};


const PaginationMovies = ({
    lowerBound = 1,
    upperBound = 500,
    currentValue = 1
}: PaginationMoviesProps) => {
    // 497, 498*, 499, 500 - *seleccionado
    // <(disabled), 1*, 2, 3, 4 >(5) - Seleccionado
    const previousPage = Math.max(currentValue - 1, lowerBound);
    const nextPage = Math.min(currentValue + 1, upperBound);

    const firstValue = Math.min(Math.max(currentValue - 1, lowerBound), upperBound - 3);
    const secondValue = Math.min(Math.max(currentValue, lowerBound + 1), upperBound - 2);
    const thirdValue = Math.min(Math.max(currentValue + 1, lowerBound + 2), upperBound - 1);
    const fourthValue = Math.min(Math.max(currentValue + 2, lowerBound + 3), upperBound);

    return (
        <Pagination className="p-6">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href={`?page=${previousPage}`} aria-disabled={currentValue <= lowerBound}></PaginationPrevious>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href={`?page=${firstValue}`} isActive={currentValue == lowerBound}>{firstValue}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href={`?page=${secondValue}`} isActive={currentValue > lowerBound && currentValue < upperBound - 1}>{secondValue}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href={`?page=${thirdValue}`} isActive={currentValue == upperBound - 1}>{thirdValue}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href={`?page=${fourthValue}`} isActive={currentValue == upperBound}>{fourthValue}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href={`?page=${nextPage}`} aria-disabled={currentValue <= upperBound - 4}></PaginationNext>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default PaginationMovies;