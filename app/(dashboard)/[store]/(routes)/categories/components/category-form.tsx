"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Billboard, Category } from "@prisma/client";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
    name: z.string().min(1, "please specify a name"),
    billboardId: z.string().min(1, "please specify a billboard")
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
    billboards: Billboard[];
    initialData: Category | null;
};

export const CategoryForm: React.FC<CategoryFormProps> = ({
    billboards,initialData
}) => {

    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();


    const [open, setOpen] = useState(false);
    const [loading, setLoading]= useState(false);

    const title = initialData ? "Edit Category" : "Create Category";
    const description = initialData ? "Edit a Category" : "Create a Category";
    const toastMessage = initialData ? "Category Updated." : "Category Created.";
    const action = initialData ? "Save Changes" : "Create";



    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            billboardId: '',
        }
    });

    const onSubmit  = async (data: CategoryFormValues) => {
        try {
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.store}/categories/${params.categoryId}`, data);
            }else{
                await axios.post(`/api/${params.store}/categories`, data);
            }
            router.push(`/${params.store}/categories`);
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
            await axios.delete(`/api/${params.store}/categories/${params.categoryId}`);
            router.push(`/${params.store}/categories`);
            router.refresh();
            toast.success("Category deleted..");
        } catch (error) {
            toast.error("Make sure you removed all products using this category first.");
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
                                placeholder="Category Name"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField 
                  control={form.control}
                  name="billboardId"
                  render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Billboard
                        </FormLabel>
                        <FormControl>
                            <Select disabled={loading} 
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            defaultValue={field.value}
                                            placeholder= "Select a Billboard"
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {billboards.map((billboard) => (
                                        <SelectItem 
                                            key={billboard.id}
                                            value={billboard.id}
                                        >
                                            {billboard.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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