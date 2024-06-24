"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Billboard } from "@prisma/client";
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
import ImageUpload from "@/components/ui/image-upload";
import { useOrigin } from "@/hooks/use-origin";

const formSchema = z.object({
    label: z.string().min(1, "please specify a name"),
    imageUrl: z.string().min(1, "please specify image url")
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
    initialData: Billboard | null;
};

export const BillboardForm: React.FC<BillboardFormProps> = ({initialData}) => {

    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();


    const [open, setOpen] = useState(false);
    const [loading, setLoading]= useState(false);

    const title = initialData ? "Edit Billboard" : "Create Billboard";
    const description = initialData ? "Edit a Billboard" : "Create a Billboard";
    const toastMessage = initialData ? "Billboard Updated." : "Billboard Created.";
    const action = initialData ? "Save Changes" : "Create";



    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: '',
        }
    });

    const onSubmit  = async (data: BillboardFormValues) => {
        try {
            setLoading(true);
            if(initialData) {
                await axios.patch(`/api/${params.store}/billboards/${params.billboardId}`, data);
            }else{
                await axios.post(`/api/${params.store}/billboards`, data);
            }
            router.push(`/${params.store}/billboards`);
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
            await axios.delete(`/api/${params.store}/billboards/${params.billboardId}`);
            router.push(`/${params.store}/billboards`);
            router.refresh();
            toast.success("Billboard deleted..");
        } catch (error) {
            toast.error("Make sure you removed all categories using this billboard first.");
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
                    <FormField 
                        control={form.control}
                        name="imageUrl"
                        render={({field}) =>  (
                        <FormItem>
                            <FormLabel>
                                Background Image
                            </FormLabel>
                            <FormControl>
                                <ImageUpload 
                                    value={field.value ? [field.value]: []}
                                    disabled={loading}
                                    onChange={(url) => field.onChange(url)}
                                    onRemove={() => field.onChange("")}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                          control={form.control}
                          name="label"
                          render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Label
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={loading}
                                        placeholder="Billboard label"
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