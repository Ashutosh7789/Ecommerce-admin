'use client';

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";

import { ColorColumn } from "./columns";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface CellActionProps {
  data: ColorColumn
};

export const CellAction: React.FC<CellActionProps> = ({data}) => {

  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id:string) => {
    navigator.clipboard.writeText(id);
    toast.success('Id copied!..')
  };

  const onUpdate = (id:string) => {
    router.push(`/${params.store}/colors/${id}`)
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.store}/colors/${data.id}`);
      router.refresh();
      toast.success("Color deleted..");
    } catch (error) {
        toast.error("Make sure you removed all products using this color first.");
    }finally{
        setLoading(false);
        setOpen(false);
    }
  };


  return (
    <>
    <AlertModal 
      isOpen={open} 
      onClose={()=> setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open Menu</span>
          <MoreHorizontal className="h-4 w-4"/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          Action
        </DropdownMenuLabel>
        <DropdownMenuItem disabled={loading} onClick={() => onUpdate(data.id)}>
          <Edit className="mr-2 h-4 w-4 "/>
          Update
        </DropdownMenuItem>
        <DropdownMenuItem disabled={loading} onClick={() => onCopy(data.id)}>
          <Copy className="mr-2 h-4 w-4 "/>
          Copy Id
        </DropdownMenuItem>
        <DropdownMenuItem disabled={loading} onClick={() => setOpen(true)}>
          <Trash className="mr-2 h-4 w-4 "/>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  )
}