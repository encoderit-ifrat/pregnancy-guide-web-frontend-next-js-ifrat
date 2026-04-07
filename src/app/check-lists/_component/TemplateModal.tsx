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
import { useQueryGetAllTemplate } from "../_api/queries/UseQueryGetAllTemplate";
import { useMutationCreateTemplate } from "../_api/mutations/UseMutationCreateTemplate";
import { toast } from "sonner";

interface TaskItem {
  _id: string;
  template_id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface Template {
  _id: string;
  title: string;
  description?: string;
  category: string;
  is_active: boolean;
  items: TaskItem[];
  createdAt: string;
  updatedAt: string;
}

interface TemplateApiResponse {
  success: boolean;
  message: string;
  data: {
    data: Template[];
    pagination: any;
  };
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplateModal({ isOpen, onClose }: TemplateModalProps) {
  const { t } = useTranslation();
  const { mutateAsync: createTemplate, isPending: isCreatingTemplate } = useMutationCreateTemplate()
  const { data: apiResponse, isLoading } = useQueryGetAllTemplate() as { data: TemplateApiResponse, isLoading: boolean };
  const templates = apiResponse?.data?.data || [];

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Set initial selection when templates are loaded
  React.useEffect(() => {
    if (templates.length > 0 && selectedIds.length === 0) {
      setSelectedIds([templates[0]._id]);
    }
  }, [templates, selectedIds]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? (prev.length > 1 ? prev.filter(i => i !== id) : prev)
        : [...prev, id]
    );
  };

  const selectedTemplates = templates.filter((t) => selectedIds.includes(t._id));
  const allTasks = selectedTemplates.flatMap(t => t.items || []);

  const handleAddTemplates = async () => {
    try {
      await createTemplate({ template_ids: selectedIds });
      toast.success(t("checklists.templateModal.success"));
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t("checklists.templateModal.error"));
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl w-full p-0 max-h-[90vh] flex flex-col overflow-hidden border-none bg-white shadow-2xl rounded-2xl [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">{t("checklists.templateModal.title")}</DialogTitle>
        {/* Header */}
        <div className="bg-[#A97AEC] p-8 relative shrink-0">
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
              {t("checklists.templateModal.title")}
            </h2>
            <p className="!text-white text-base  font-outfit max-w-2xl">
              {t("checklists.templateModal.description")}
            </p>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Left Column: List */}
          <div className="w-[40%] border-r border-gray-100 p-6 overflow-y-auto">
            <h3 className="text-3xl font-medium text-[#1B1343] font-outfit mb-6">
                {t("checklists.templateModal.availableTemplates")}
            </h3>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A97AEC]"></div>
                </div>
              ) : templates.length === 0 ? (
                <p className="text-center text-gray-500 py-20">{t("checklists.templateModal.noTemplates")}</p>
              ) : (
                templates.map((template) => (
                  <div
                    key={template._id}
                    onClick={() => toggleSelection(template._id)}
                    className={cn(
                      "p-5 rounded-xl border transition-all cursor-pointer group relative",
                      selectedIds.includes(template._id)
                        ? "border-[#A97AEC] bg-[#A97AEC0D]"
                        : "border-gray-100 hover:border-[#A97AEC]/30 hover:bg-gray-50/50"
                    )}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-[#101828] font-poppins text-base font-semibold">
                        {template.title}
                      </div>
                      {selectedIds.includes(template._id) && (
                        <div className="size-[22px] rounded-full border-2 border-[#A97AEC] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="size-3 text-[#A97AEC]" strokeWidth={4} />
                        </div>
                      )}
                    </div>
                    {template.description && (
                      <p className="text-[#1B1343] text-base font-outfit mb-4 leading-relaxed line-clamp-2">
                        {template.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-[#1B1343] font-medium text-base">
                      <div className="size-[22px] rounded-full border-2 border-[#A97AEC] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="size-3 text-[#A97AEC]" strokeWidth={4} />
                      </div>
                      {t("checklists.templateModal.tasksCount", { count: template.items?.length || 0 })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="flex-1 bg-gray-50/30 p-6 overflow-y-auto">
            <h3 className="text-3xl font-medium text-[#1B1343] font-outfit mb-6">
                {t("checklists.templateModal.templatePreview")}
            </h3>

            <div className="space-y-4">
              {selectedTemplates.length > 0 ? (
                <>
                  {/* Preview Header Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h4 className="text-[#101828] font-poppins text-base font-semibold">
                      {selectedTemplates.length === 1
                        ? selectedTemplates[0].title
                        : t("checklists.templateModal.templatesSelected", { count: selectedTemplates.length })}
                    </h4>
                    {selectedTemplates.length === 1 && selectedTemplates[0].description && (
                      <p className="text-[#1B1343] text-base font-outfit mb-4 leading-relaxed line-clamp-2">
                        {selectedTemplates[0].description}
                      </p>
                    )}
                    <p className="text-[#1B1343] font-medium text-base">
                      {t("checklists.templateModal.selectionContains")}{" "}
                      <span className="text-[#1B1343] font-semibold">
                        {t("checklists.templateModal.tasksCount", { count: allTasks.length })}
                      </span>
                    </p>
                  </div>

                  {/* Tasks List */}
                  {allTasks.map((task, index) => (
                    <div
                      key={`${task._id}-${index}`}
                      className="bg-white p-4 rounded-xl border border-gray-100 flex items-start gap-4 shadow-sm"
                    >
                      <div className="size-6 rounded-full border-2 border-gray-200 mt-1 flex-shrink-0" />
                      <div className="flex-1 space-y-1">
                        <h5 className="text-sm font-medium text-primary-dark font-poppins">
                          {task.title}
                        </h5>
                        {task.description && (
                          <p className="text-gray-500 text-sm font-outfit">
                            {task.description}
                          </p>
                        )}
                        <div className="pt-2">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1",
                              task.priority === "high"
                                ? "bg-[#FFFBE5] text-[#BB4D00] ring-[#FEE685]"
                                : task.priority === "medium"
                                  ? "bg-[#E1EFFE] text-[#1E429F] ring-[#C3DDFD]"
                                  : "bg-[#DEF7EC] text-[#03543F] ring-[#BCF0DA]"
                            )}
                          >
                            <div
                              className={cn(
                                "size-1.5 rounded-full",
                                task.priority === "high"
                                  ? "bg-[#D99B6A]"
                                  : task.priority === "medium"
                                    ? "bg-[#3F83F8]"
                                    : "bg-[#31C48D]"
                              )}
                            />
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-400 font-outfit">{t("checklists.templateModal.selectToPreview")}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-white shrink-0">
          <p className="text-primary-dark/80 font-medium font-outfit text-lg">
            {selectedTemplates.length === 1
                ? t("checklists.templateModal.footerText.addOne", { title: selectedTemplates[0].title })
                : t("checklists.templateModal.footerText.addMany", { count: selectedTemplates.length })}
          </p>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-12 px-8 rounded-full border-primary/20 text-primary hover:bg-primary/5 font-outfit font-bold text-lg"
            >
              {t("checklists.templateModal.cancel")}
            </Button>
            <Button
              onClick={handleAddTemplates}
              disabled={isCreatingTemplate || selectedIds.length === 0}
              className="h-12 px-8 rounded-full bg-[#A97AEC] hover:bg-[#9333EA] text-white flex items-center gap-3 font-outfit font-bold text-lg shadow-lg shadow-purple-200"
            >
              {isCreatingTemplate ? t("checklists.templateModal.adding") : t("checklists.templateModal.add")}
              {!isCreatingTemplate && (
                <div className="size-6 rounded-full bg-white text-primary flex items-center justify-center">
                  <Plus className="size-4" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
