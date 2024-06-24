"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Color } from "@prisma/client";
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
    value: z.string().min(4).regex(/^#/, "String must be a valid hex code"),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
    initialData: Color | null;
};

export const ColorForm: React.FC<ColorFormProps> = ({initialData}) => {

    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();


    const [open, setOpen] = useState(false);
    const [loading, setLoading]= useState(false);

    const title = initialData ? "Edit Color" : "Create Color";
    const description = initialData ? "Edit a Color" : "Create a Color";
    const toastMessage = initialData ? "Color Updated." : "Color Created.";
    const action = initialData ? "Save Changes" : "Create";



    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: '',
        }
    });

    const onSubmit  = async (data: ColorFormValues) => {
        try {
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.store}/colors/${params.colorId}`, data);
            }else{
                await axios.post(`/api/${params.store}/colors`, data);
            }
            router.push(`/${params.store}/colors`);
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
            await axios.delete(`/api/${params.store}/colors/${params.colorId}`);
            router.push(`/${params.store}/colors`);
            router.refresh();
            toast.success("Color deleted..");
        } catch (error) {
            toast.error("Make sure you removed all products using this color first.");
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
                                  placeholder="Color name..."
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
                                <div className="flex items-center gap-x-4">
                                    <Input 
                                        disabled={loading}
                                        placeholder="Color value..."
                                        {...field}
                                    />
                                    <span 
                                        className="border p-4 rounded-full" 
                                        style={{backgroundColor: field.value}}
                                    />
                                </div>
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