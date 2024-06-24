"use client"

import { Plus as PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";


import { SizeColumn, columns } from "./columns";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";


interface SizeClientProps{
    data:  SizeColumn[];
};

export const SizeClient: React.FC<SizeClientProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();

  return (
    <>
        <div className="flex items-center justify-between">
            <Heading 
                title={`Sizes (${data.length})`}
                description="Manage Sizes for your store"
            />
            <Button
                onClick={() => router.push(`/${params.store}/sizes/new`)}
            >
                <PlusIcon className="mr-2 h-4 w-4"/>
                Add New
            </Button>
        </div>
        <Separator />
        <DataTable  searchKey="name" columns={columns} data={data}/>
        <Heading title="API" description="API calls for Sizes"/>
        <Separator />
        <ApiList entityName="sizes"
        entityIdName="sizeId"
        />
    </>
  )
};
