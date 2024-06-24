import { Metadata } from "next";
import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { SizeClient } from "./components/size-client";
import { SizeColumn } from "./components/columns";


export const metadata: Metadata = {
    title: "Admin | Sizes",
    description: "Admin Sizes Page"
};


const Sizes = async ({
    params
}:{
    params:  {store: string}
}) => {

    const sizes = await prismadb.size.findMany({
        where:{
         storeId: params.store   
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedSizes: SizeColumn[] = sizes.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeClient data={formattedSizes} />
            </div>
        </div>
    )
};


export default Sizes;