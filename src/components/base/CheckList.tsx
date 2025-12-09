"use client";
import React, { useState } from "react";
import { CheckBox } from "../ui/Checkbox";
import { useToggleChecklist } from "@/app/pregnancy-overview/_api";
import { Spinner } from "../ui/Spinner";
import { toast } from "sonner";
import { CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

type TProps = {
  data: {
    _id: string;
    title: string;
    description: string;
    is_checked: boolean;
  };
};

const CheckList: React.FC<TProps> = ({ data }) => {
  const { _id, title, description } = data;
  // const [checked, setChecked] = useState(is_checked);

  return (
    <Link
      href={`/check-lists`}
      // key={itm.id}
      // onClick={() => handleChecklistToggle(item.id)}
      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all bg-gray-50 border-2 border-gray-200 hover:border-purple-300`}
      // onClick={handelToggleChecklist}
    >
      <div className="flex-1">
        <span className={`text-lg font-semibold text-gray-700 block`}>
          {title}
        </span>
        {description && (
          <p className={`text-sm text-gray-600 mt-1`}>{description}</p>
        )}
      </div>
    </Link>
  );
};

export default CheckList;
