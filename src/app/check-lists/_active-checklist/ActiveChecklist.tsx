import OverallProgress from "@/components/ui/overall-progress";
import React from "react";
import CheckList from "../_component/CheckList";

export default function ActiveChecklist() {
  return (
    <div className="">
      <OverallProgress />
      <CheckList />
    </div>
  );
}
