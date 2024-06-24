import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";


import prismadb from "@/lib/prismadb";

export const POST = async (req: Request, res: Response) => {
    try {
        const {userId} = auth();
        const body = await req.json();
        const {name} = body;
        if(!userId){
            return new NextResponse("Unauthorized",{status: 401});
        }

        if(!name){
            return new NextResponse("Name Required",{status: 400});
        }

        const store = await prismadb.store.create({
            data:{
                name,
                userId
            }
        });

        return NextResponse.json(store);
        
    } catch (error) {
        console.log('[Store_POST]',error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}