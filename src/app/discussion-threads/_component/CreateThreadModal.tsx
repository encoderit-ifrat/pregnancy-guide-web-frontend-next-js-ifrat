"use client";

import React from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";
import { Button } from '@/components/ui/Button';
import { ChevronRight } from 'lucide-react';
import { Textarea } from '@/components/ui/Textarea';

interface CreateThreadModalProps {
    children: React.ReactNode;
}

export default function CreateThreadModal({ children }: CreateThreadModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent
                className="w-full lg:max-w-4xl flex flex-col p-0 rounded-[40px] border-none overflow-hidden bg-white"
                showCloseButton={false}
            >
                <DialogTitle className="sr-only">Start a New Thread</DialogTitle>

                {/* Custom Close Button */}
                <DialogPrimitive.Close className="absolute top-8 right-8 size-10 bg-white rounded-full border-4 border-[#3D3177] flex items-center justify-center text-primary-color hover:bg-[#F6F0FF] transition-colors z-15 shadow-sm">
                    <span className="text-2xl leading-none font-bold">x</span>
                </DialogPrimitive.Close>

                <div className="p-12 md:p-16">
                    <h2 className="text-[45px] font-semibold text-primary-color mb-9">
                        Start a New Thread
                    </h2>

                    <div className="flex flex-col gap-8">
                        {/* Title Input */}
                        <div className="flex flex-col gap-3">
                            <label className="text-3xl font-semibold text-primary-color">Title</label>
                            <input
                                type="text"
                                placeholder="Create your thread tittle"
                                className="w-full border-2 border-[#DED7F1] rounded-2xl py-4 px-6 text-lg focus:ring-2 focus:ring-[#9A79F1]/20 focus:border-[#9A79F1] outline-none text-primary-color placeholder:text-[#D1C6F0] transition-colors"
                            />
                        </div>

                        {/* Description Input */}
                        <div className="flex flex-col gap-3">
                            <label className="text-3xl font-semibold text-primary-color">Description</label>
                            <Textarea
                                rows={6}
                                placeholder="Textarea..............................."
                                className="w-full border-2 border-[#DED7F1] rounded-2xl py-4 px-6 text-lg focus:ring-2 focus:ring-[#9A79F1]/20 focus:border-[#9A79F1] outline-none text-primary-color placeholder:text-[#D1C6F0] transition-colors resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-12">
                        <Button className="font-semibold h-12 rounded-full px-10 text-lg gap-2" variant="default">
                            Publish Thread
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
