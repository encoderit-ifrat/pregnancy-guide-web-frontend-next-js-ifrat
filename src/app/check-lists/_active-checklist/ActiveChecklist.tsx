import OverallProgress from "@/components/ui/overall-progress";
import React from "react";
import CheckList from "../_component/CheckList";

export default function ActiveChecklist() {
  return (
    <div className="space-y-10">
      <OverallProgress />
      <CheckList />
    </div>
  );
}
