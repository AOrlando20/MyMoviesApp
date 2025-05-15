"use client"

import { TooltipProvider } from "@/components/ui/tooltip"

const MovieDetailLayout = ({
    children
}: Readonly<{ children: React.ReactNode }>) => {
    return (
        <TooltipProvider>
            {children}
        </TooltipProvider>
    )
}

export default MovieDetailLayout;