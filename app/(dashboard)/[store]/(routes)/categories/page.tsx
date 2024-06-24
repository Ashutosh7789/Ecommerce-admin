import { Metadata } from "next";
import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { CategoryClient } from "./components/category-client";
import { CategoryColumn } from "./components/columns";

export const metadata: Metadata = {
    title: "Admin | Categories",
    description: "Admin Categories Page"
};



const Categories = async ({
    params
}:{
    params:  {store: string}
}) => {

    const categories = await prismadb.category.findMany({
        where:{
         storeId: params.store   
        },
        include: {
            billboard: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedCategories: CategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryClient data={formattedCategories} />
            </div>
        </div>
    )
};


export default Categories;