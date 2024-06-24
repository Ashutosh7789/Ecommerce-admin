"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ImagePlus as ImagePlusIcon, Trash as TrashIcon } from "lucide-react";
import {CldUploadWidget} from "next-cloudinary";

import { Button } from "@/components/ui/button";


interface ImageUploadProps{
    disabled: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value
}) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    },[]);

    const onUpload = (result: any) => {
        const url = result.info.secure_url;
        onChange(url);
    } 

    if(!isMounted) {
        return null;
    }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
            <div key={url} className="relative w-[200px] h-[200px] overflow-hidden rounded-md">
                <div className="z-10 absolute top-2 right-2">
                    <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                        <TrashIcon className="h-4 w-4"/>
                    </Button>
                </div>
                <Image 
                    sizes="200px"
                    fill
                    className="object-cover"
                    alt="Image"
                    src={url}
                />
            </div>
        ))}
      </div>
      <CldUploadWidget onSuccess={onUpload} uploadPreset="ueirxrym">
        {({open}) => {
            const onClick = () => {
                open();
            }
            return (
                <Button type="button"
                    disabled={disabled}
                    variant="secondary"
                    onClick={onClick}
                >
                    <ImagePlusIcon className="h-4 w-4 mr-2"/>
                    Upload an Image
                </Button>
            )
        }}
      </CldUploadWidget>
    </div>
  )
}

export default ImageUpload;
