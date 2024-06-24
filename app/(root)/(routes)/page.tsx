"use client"

import { Modal } from "@/components/ui/Modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton } from "@clerk/nextjs";
import { useEffect } from "react";


export default function Home() {

  const isOpen = useStoreModal((state) => state.isOpen);
  const onOpen = useStoreModal((state) => state.onOpen);

  useEffect(() => {
    if(!isOpen){
      onOpen();
    }
  },[isOpen, onOpen]);

  return null;
}
