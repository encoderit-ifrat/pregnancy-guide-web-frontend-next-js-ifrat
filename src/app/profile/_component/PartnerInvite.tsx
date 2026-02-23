"use client";

import React, { useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import IconDelete from "@/components/svg-icon/icon-delete";


interface InvitedPartner {
    email: string;
    status: "invited" | "Accepted";
}

export default function PartnerInvite() {
    const [partners, setPartners] = useState<InvitedPartner[]>([
        { email: "john@email.com", status: "invited" },
        { email: "alice@email.com", status: "Accepted" },
        { email: "john@email.com", status: "invited" },
        { email: "alice@email.com", status: "Accepted" },
    ]);

    const [email, setEmail] = useState("");
    const [role, setRole] = useState("Partner");

    const handleDelete = (index: number) => {
        setPartners(partners.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full bg-white rounded-2xl shadow-lg border border-[#F3EAFF] overflow-hidden">
            {/* Upper Section: Invite Form */}
            <div className="p-6 bg-[#FBF8FF] border-b border-[#F3EAFF]">
                <h3 className="text-[#4D2C82] text-xl font-semibold mb-3 flex items-center gap-2">
                    Partner Invite
                </h3>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center max-w-2xl relative ">
                    <div className="flex flex-1 items-stretch h-11  border-[#A97AEC] rounded-lg border bg-white overflow-hidden">
                        <input
                            type="email"
                            placeholder="Enter Partner Email....."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 px-4 py-2 text-[#A179F2] placeholder:text-[#A179F2]/60 outline-none text-sm md:text-base border-r border-[#A97AEC]"
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center justify-between gap-4 px-4 bg-white text-[#A179F2] hover:bg-[#FBF8FF] transition-colors min-w-[110px] text-sm md:text-base border-r border-[#A179F2]">
                                    {role}
                                    <ChevronDown className="size-4 opacity-70" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setRole("Partner")} className="text-[#A179F2]">Partner</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setRole("Other")} className="text-[#A179F2]">Other</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <button
                            className="bg-[#A179F2] hover:bg-[#8B5CF6] text-white px-6 font-medium transition-colors text-sm md:text-base whitespace-nowrap"
                            onClick={() => {
                                if (email) {
                                    setPartners([...partners, { email, status: "invited" }]);
                                    setEmail("");
                                }
                            }}
                        >
                            Send Invitation
                        </button>
                    </div>
                </div>
            </div>

            {/* Lower Section: Email List */}
            <div className="p-6 bg-white">
                <h4 className="text-[#4D2C82] text-xl font-semibold mb-2 text-left">Email Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 bg-soft-white">
                    {partners.map((partner, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-[#FBF8FF] rounded-lg border border-[#F3EAFF]  hover:shadow-md transition-shadow"
                        >
                            <span className="text-[#5B5B5B] text-sm md:text-base font-semibold truncate mr-2">
                                {partner.email}
                            </span>
                            <div className="flex items-center gap-3 shrink-0">
                                <Badge
                                    className={cn(
                                        "px-4 py-1 text-sm  font-semibold min-w-[90px] text-center border-none",
                                        partner.status === "invited"
                                            ? "bg-[#FFBB55] text-white"
                                            : "bg-[#4ADE80] text-white"
                                    )}
                                >
                                    {partner.status}
                                </Badge>
                                <button

                                    onClick={() => handleDelete(index)}
                                    className="text-[#4D2C82] hover:text-red-500 transition-colors p-1"
                                >
                                    <IconDelete className="size-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
