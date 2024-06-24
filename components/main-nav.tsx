"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

import { useParams, usePathname } from "next/navigation";


export function MainNav({
    className,
    ...props
}:React.HTMLAttributes<HTMLElement>){

    const pathname = usePathname();
    const params = useParams();
    const routes = [
        {
            href: `/${params.store}`,
            label: "Overview",
            active: pathname === `/${params.store}`
        },
        {
            href: `/${params.store}/billboards`,
            label: "Billboards",
            active: pathname === `/${params.store}/billboards`
        },
        {
            href: `/${params.store}/categories`,
            label: "Categories",
            active: pathname === `/${params.store}/categories`
        },
        {
            href: `/${params.store}/sizes`,
            label: "Sizes",
            active: pathname === `/${params.store}/sizes`
        },
        {
            href: `/${params.store}/colors`,
            label: "Colors",
            active: pathname === `/${params.store}/colors`
        },
        {
            href: `/${params.store}/products`,
            label: "Products",
            active: pathname === `/${params.store}/products`
        },
        {
            href: `/${params.store}/orders`,
            label: "Orders",
            active: pathname === `/${params.store}/orders`
        },
        {
            href: `/${params.store}/settings`,
            label: "Settings",
            active: pathname === `/${params.store}/settings`
        },
    ];


    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
            {
                routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn("text-sm font-medium transition-colors hover:text-primary",
                        route.active ? "text-black dark:text-white":"text-muted-foreground"
                        )}
                    >
                        {route.label}
                    </Link>
                ))
            }
        </nav>
    )
}