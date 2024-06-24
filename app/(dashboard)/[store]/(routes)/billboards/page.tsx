import { Metadata } from "next";
import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { BillboardClient } from "./components/billboard-client";
import { billboardColumn } from "./components/columns";


export const metadata: Metadata = {
    title: "Admin | Billboard",
    description: "Admin Billboard Page"
};


const Billboards = async ({
    params
}:{
    params:  {store: string}
}) => {

    const billboards = await prismadb.billboard.findMany({
        where:{
         storeId: params.store   
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedBillboards: billboardColumn[] = billboards.map((item) => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data={formattedBillboards} />
            </div>
        </div>
    )
};


export default Billboards;