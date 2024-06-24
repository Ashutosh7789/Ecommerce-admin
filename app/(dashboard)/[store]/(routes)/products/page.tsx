import { Metadata } from "next";
import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { ProductClient } from "./components/product-client";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";


export const metadata: Metadata = {
    title: "Admin | Products",
    description: "Admin Products Page"
};


const Products = async ({
    params
}:{
    params:  {store: string}
}) => {

    const products = await prismadb.product.findMany({
        where:{
         storeId: params.store   
        },
        include:{
          category: true,
          size: true,
          color: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        price: formatter.format(item.price.toNumber()),
        isArchived: item.isArchived,
        isFeatured: item.isFeatured,
        size: item.size.value,
        category: item.category.name,
        color: item.color.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts} />
            </div>
        </div>
    )
};


export default Products;