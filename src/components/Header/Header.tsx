"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";


const links = [
    { href: '/popular', label: 'Popular' },
    { href: '/now-playing', label: 'Now Playing'},
    { href: '/top-rated', label: 'Top Rated' },
    { href: '/my-favorites', label: 'My Favorites' }
]

const nombreSitio = "PeliculasHD"


const Header = () => {
    const pathname = usePathname();

    return (
        <header className="w-full border-b shadow-sm bg-gradient-to-r from-indigo-800 to-indigo-950">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between px-8 py-3">
                <Link href={"/"} className="text-xl font-bold text-white hover:text-indigo-300 transition-colors">
                    {nombreSitio}
                </Link>

                <nav className="flex flex-col sm:flex-row p-3 xs:p-0 gap-6">
                    { links.map(({ href, label }) => {
                        return (
                            <Link 
                                key={href}
                                href={href}
                                className={clsx(
                                "text-sm font-medium transition-colors hover:text-indigo-300",
                                pathname === href ? "text-indigo-300 underline" : "text-white"
                            )}>
                                {label}
                            </Link>
                        );
                    }) }
                </nav>
            </div>
        </header>
    );
}

export default Header;