"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  X,
  CheckCircle2,
  ListTodo,
  Sparkles,
  Search,
  Plus,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface Template {
  id: string;
  title: string;
  description: string;
  taskCount: number;
  tasks: Task[];
}

const MOCK_TEMPLATES: Template[] = [
  {
    id: "baby-prep",
    title: "Baby Preparation",
    description: "Essential tasks to prepare for your baby's arrival",
    taskCount: 8,
    tasks: [
      {
        id: "1",
        title: "Set up nursery",
        description: "Paint, furniture, decorations",
        priority: "high",
      },
      {
        id: "2",
        title: "Buy baby clothes",
        description: "Newborn to 3 months sizes",
        priority: "high",
      },
      {
        id: "3",
        title: "Install car seat",
        description: "Get it professionally checked",
        priority: "high",
      },
      {
        id: "4",
        title: "Prepare hospital bag",
        description: "For both mom and baby",
        priority: "high",
      },
      {
        id: "5",
        title: "Stock up on diapers",
        description: "Various sizes for the first month",
        priority: "medium",
      },
      {
        id: "6",
        title: "Wash baby linens",
        description: "Use baby-safe detergent",
        priority: "low",
      },
      {
        id: "7",
        title: "Cook freezer meals",
        description: "Prepare easy meals for after birth",
        priority: "medium",
      },
      {
        id: "8",
        title: "Choose a pediatrician",
        description: "Interview and check insurance",
        priority: "high",
      },
    ],
  },
  {
    id: "hospital",
    title: "Hospital Checklist",
    description: "Everything you need to pack for the hospital",
    taskCount: 6,
    tasks: [
      { id: "101", title: "Insurance info", description: "And ID cards", priority: "high" },
      { id: "102", title: "Birth plan", description: "Printed copies", priority: "high" },
    ],
  },
  {
    id: "first-trim",
    title: "First Trimester To-Do",
    description: "Important tasks for your first trimester",
    taskCount: 7,
    tasks: [],
  },
  {
    id: "postpartum",
    title: "Postpartum Preparation",
    description: "Get ready for life after baby arrives",
    taskCount: 6,
    tasks: [],
  },
];

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplateModal({ isOpen, onClose }: TemplateModalProps) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState(MOCK_TEMPLATES[0].id);

  const selectedTemplate =
    MOCK_TEMPLATES.find((t) => t.id === selectedId) || MOCK_TEMPLATES[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl w-full p-0 overflow-hidden border-none bg-white shadow-2xl rounded-2xl [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">Ready-Made Templates</DialogTitle>
        {/* Header */}
        <div className="bg-[#A97AEC] p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
          >
            <div className="size-8 rounded-full border-2 border-white flex items-center justify-center">
              <X className="size-5" />
            </div>
          </button>
          <div className="space-y-1">
            <h2 className="text-[45px] font-semibold text-white font-poppins tracking-tight">
              Ready-Made Templates
            </h2>
            <p className="!text-white text-base  font-outfit max-w-2xl">
              Expert advice, real stories, and helpful tips to support you and
              your family at every stage.
            </p>
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Left Column: List */}
          <div className="w-[40%] border-r border-gray-100 p-6 overflow-y-auto">
            <h3 className="text-3xl font-medium text-[#1B1343] font-outfit mb-6">
              Available Templates
            </h3>
            <div className="space-y-4">
              {MOCK_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedId(template.id)}
                  className={cn(
                    "p-5 rounded-xl border transition-all cursor-pointer group relative",
                    selectedId === template.id
                      ? "border-[#A97AEC] bg-[#A97AEC0D]"
                      : "border-gray-100 hover:border-[#A97AEC]/30 hover:bg-gray-50/50"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-[#101828] font-poppins text-base font-semibold">
                      {template.title}
                    </div>
                    {selectedId === template.id && (
                      <div className="size-[22px] rounded-full border-2 border-[#A97AEC] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="size-3 text-[#A97AEC]" strokeWidth={4} />
                      </div>
                    )}
                  </div>
                  <p className="text-[#1B1343] text-base font-outfit mb-4 leading-relaxed line-clamp-2">
                    {template.description}
                  </p>
                  <div className="flex items-center gap-2 text-[#1B1343] font-medium text-base">
                    <div className="size-[22px] rounded-full border-2 border-[#A97AEC] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="size-3 text-[#A97AEC]" strokeWidth={4} />
                    </div>
                    {template.taskCount} tasks
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="flex-1 bg-gray-50/30 p-6 overflow-y-auto">
            <h3 className="text-3xl font-medium text-[#1B1343] font-outfit mb-6">
              Template Preview
            </h3>

            <div className="space-y-4">
              {/* Preview Header Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="text-[#101828] font-poppins text-base font-semibold">
                  {selectedTemplate.title}
                </h4>
                <p className="text-[#1B1343] text-base font-outfit mb-4 leading-relaxed line-clamp-2">
                  {selectedTemplate.description}
                </p>
                <p className="text-[#1B1343] font-medium text-base">
                  This template contains{" "}
                  <span className="text-[#1B1343] font-semibold">{selectedTemplate.taskCount} tasks</span>
                </p>
              </div>

              {/* Tasks List */}
              {selectedTemplate.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-xl border border-gray-100 flex items-start gap-4 shadow-sm"
                >
                  <div className="size-6 rounded-full border-2 border-gray-200 mt-1 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <h5 className="text-sm font-medium text-primary-dark font-poppins">
                      {task.title}
                    </h5>
                    <p className="text-gray-500 text-sm font-outfit">
                      {task.description}
                    </p>
                    <div className="pt-2">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1",
                        task.priority === "high" ? "bg-[#FFFBE5] text-[#BB4D00] ring-[#FEE685]" :
                          task.priority === "medium" ? "bg-[#E1EFFE] text-[#1E429F] ring-[#C3DDFD]" :
                            "bg-[#DEF7EC] text-[#03543F] ring-[#BCF0DA]"
                      )}>
                        <div className={cn(
                          "size-1.5 rounded-full",
                          task.priority === "high" ? "bg-[#D99B6A]" :
                            task.priority === "medium" ? "bg-[#3F83F8]" :
                              "bg-[#31C48D]"
                        )} />
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-white">
          <p className="text-primary-dark/80 font-medium font-outfit text-lg">
            Add <span className="font-bold">"{selectedTemplate.title}"</span> to your checklist
          </p>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-12 px-8 rounded-full border-primary/20 text-primary hover:bg-primary/5 font-outfit font-bold text-lg"
            >
              Cancel
            </Button>
            <Button
              className="h-12 px-8 rounded-full bg-[#A97AEC] hover:bg-[#9333EA] text-white flex items-center gap-3 font-outfit font-bold text-lg shadow-lg shadow-purple-200"
            >
              Add
              <div className="size-6 rounded-full bg-white text-primary flex items-center justify-center">
                <Plus className="size-4" />
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
