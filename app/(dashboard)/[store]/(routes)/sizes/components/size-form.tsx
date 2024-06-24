"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Size } from "@prisma/client";
import * as z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash as TrashIcon } from "lucide-react";


import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { useOrigin } from "@/hooks/use-origin";

const formSchema = z.object({
    name: z.string().min(1, "please specify a name"),
    value: z.string().min(1, "please specify value")
});

type SizeFormValues = z.infer<typeof formSchema>;

interface SizeFormProps {
    initialData: Size | null;
};

export const SizeForm: React.FC<SizeFormProps> = ({initialData}) => {

    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();


    const [open, setOpen] = useState(false);
    const [loading, setLoading]= useState(false);

    const title = initialData ? "Edit Size" : "Create Size";
    const description = initialData ? "Edit a Size" : "Create a Size";
    const toastMessage = initialData ? "Size Updated." : "Size Created.";
    const action = initialData ? "Save Changes" : "Create";



    const form = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: '',
        }
    });

    const onSubmit  = async (data: SizeFormValues) => {
        try {
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.store}/sizes/${params.sizeId}`, data);
            }else{
                await axios.post(`/api/${params.store}/sizes`, data);
            }
            router.push(`/${params.store}/sizes`);
            router.refresh();
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Something went wrong")
        }finally{
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.store}/sizes/${params.sizeId}`);
            router.push(`/${params.store}/sizes`);
            router.refresh();
            toast.success("Size deleted..");
        } catch (error) {
            toast.error("Make sure you removed all products using this size first.");
        }finally{
            setLoading(false);
            setOpen(false);
        }
    }


    return (
        <>
            <AlertModal 
                isOpen={open}
                onClose={() => setOpen(false)}
                loading={loading}
                onConfirm={onDelete}
            />
            <div className="flex items-center justify-between">
                <Heading 
                    title={title}
                    description={description}
                />
                {initialData && (
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setOpen(true)}
                >
                    <TrashIcon className="h-4 w-4"/>
                </Button> )}
            </div>
            <Separator />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 w-full"
              >
                <div className="grid grid-cols-3 gap-8">
                  <FormField 
                    control={form.control}
                    name="name"
                    render={({field}) => (
                      <FormItem>
                          <FormLabel>
                              Name
                          </FormLabel>
                          <FormControl>
                              <Input 
                                  disabled={loading}
                                  placeholder="Size name..."
                                  {...field}
                              />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField 
                    control={form.control}
                    name="value"
                    render={({field}) => (
                      <FormItem>
                          <FormLabel>
                              Value
                          </FormLabel>
                          <FormControl>
                              <Input 
                                  disabled={loading}
                                  placeholder="Size value..."
                                  {...field}
                              />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button 
                    type="submit"
                    disabled={loading}
                >
                  {action}
                </Button> 
              </form>
            </Form>
            <Separator />
        </>
    )
};