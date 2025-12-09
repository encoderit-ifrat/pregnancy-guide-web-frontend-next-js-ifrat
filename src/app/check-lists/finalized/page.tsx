"use client";
import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  CornerDownLeft,
  Plus,
  Square,
  SquarePen,
  Trash2,
} from "lucide-react";
import CheckList from "@/components/base/CheckList";
import { AppDialog } from "@/components/base/AppDialog";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { DeleteConfirmDialog } from "@/components/base/DeleteConfirmDialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import Pagination from "@/components/base/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useQueryGetAllMyChecklists,
  useQueryGetAllMyCompletedChecklists,
} from "../_api/queries/useQueryGetAllMyChecklists";
import { useMutationToggleChecklist } from "../_api/mutations/UseMutationToggleChecklist";
import { useMutationDeleteChecklist } from "../_api/mutations/UseMutationDeleteChecklist";
import Loading from "@/app/loading";
import ChecklistForm from "../_component/CheckListForm";
import Link from "next/link";

export default function CheckLists() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryID = searchParams.get("id");
  const page = searchParams.get("page") || "1";

  const [formData, setFormData] = useState<{
    type: "default" | "update" | "delete";
    id: string;
    data?: any;
  }>({ type: "default", id: "" });
  const { isAuthenticated } = useCurrentUser();
  const { data, isLoading, refetch, isFetching } =
    useQueryGetAllMyCompletedChecklists({
      params: {
        id: queryID ?? "",
        page: page,
      },
    });
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const { mutate: toggleChecklist, isPending } = useMutationToggleChecklist();
  const { mutate: deleteChecklist, isPending: isPendingDeleteChecklist } =
    useMutationDeleteChecklist();
  const { data: checklists, pagination: meta } = data?.data ?? {};
  const [filteredLists, setFilterLists] = useState(() => checklists);
  useEffect(() => {
    setFilterLists(checklists);
  }, [checklists]);
  function handleChecklistToggle(id: string) {
    setToggleLoading(id);
    toggleChecklist(
      { id },
      {
        onSuccess(res) {
          toast.success("Checklist updated successfully.");
          setFilterLists((old: any) =>
            old.map((item: any) => {
              return {
                ...item,
                items: item.items.map((data: any) => {
                  if (data._id == id) {
                    return {
                      ...data,
                      checked: !data.checked,
                    };
                  } else {
                    return data;
                  }
                }),
              };
            })
          );
          refetch();
          setToggleLoading(null);
        },
        onError(res) {
          setToggleLoading(null);
        },
      }
    );
  }
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/check-lists/finalized?${params.toString()}`);
  };

  const AddChecklistTrigger = (
    <div
      onClick={(e) => {
        if (!isAuthenticated) {
          e.preventDefault();
          toast.warning("Please log in to add a checklist");
        }
      }}
      className={`flex items-center border bg-soft-white border-gray rounded-full px-4 py-2 transition w-auto hover:opacity-90 ${
        isAuthenticated
          ? "cursor-pointer hover:bg-purple-50"
          : "opacity-50 cursor-not-allowed"
      }`}
    >
      <div className="flex items-center justify-center text-white bg-primary rounded-full w-10 h-10 hover:bg-primary-dark transition-all">
        <Plus size={22} strokeWidth={3} />
      </div>
      <span className="pl-4 text-bg-primary text-base lg:text-lg font-medium">
        Add Checklist
      </span>
    </div>
  );

  if (isLoading || isFetching) {
    return <Loading />;
  }

  return (
    <div className="min-h-svh pb-96">
      {/* CHECKLISTS Section */}
      <div className="px-4 pt-40 lg:pt-40 lg:text-start max-w-[1200px] mx-auto pb-7 lg:pb-60 flex flex-col">
        <div className="flex gap-4 mb-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={"/check-lists"}>
              <CornerDownLeft />
            </Link>
          </Button>
          <p className="text-foreground font-semibold leading-20px text-2xl lg:text-4xl">
            Finalized Checklists
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-3">
          {filteredLists?.map((item: any, index: number) => {
            const hasItemDetails =
              item?.items?.length > 0 &&
              item.items.some((itm: any) => itm.title && itm.description);

            return (
              <AccordionItem
                key={item._id}
                value={`item-${index}`}
                className="bg-white rounded-2xl shadow-lg border border-purple-100 pr-2"
              >
                <AccordionTrigger
                  className={`flex items-center justify-between pr-4${
                    !hasItemDetails ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 size-full p-4">
                    <div className="flex flex-1 items-center gap-3">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <CheckCircle2 className="h-6 w-6 text-soft" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl md:text-2xl font-bold text-[#300043] w-full max-w-32 md:max-w-md truncate">
                          {item.title}
                        </h2>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 rounded-lg space-y-2">
                  {item?.items?.map((itm: any, idx: number) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                        itm.checked
                          ? "bg-green-50 border-2 border-green-300"
                          : "bg-gray-50 border-2 border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="pt-0.5">
                        {toggleLoading == itm._id && isPending ? (
                          <Spinner variant="circle" />
                        ) : itm.checked ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
                        ) : (
                          <Circle className="h-6 w-6 text-gray-400 shrink-0" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span
                          className={`text-lg block ${
                            itm.checked
                              ? "text-green-800 line-through"
                              : "text-gray-700"
                          }`}
                        >
                          {itm.title}
                        </span>
                        {itm.description && (
                          <p
                            className={`text-sm mt-1 ${
                              itm.checked
                                ? "text-green-700 opacity-75"
                                : "text-gray-600"
                            }`}
                          >
                            {itm.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        {meta && meta.last_page > 1 && (
          <div className="w-full max-w-3xl mx-auto mt-8">
            <Pagination
              currentPage={meta.current_page}
              totalPages={meta.last_page} // ← Changed from meta.total to meta.last_page
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
      <AlertDialog
        open={formData.type == "delete"}
        onOpenChange={() => setFormData({ type: "default", id: "" })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={() => {
                deleteChecklist(
                  { id: formData.id },
                  {
                    onSuccess: async (data) => {
                      await refetch();
                      toast.success("Check list deleted successfully");
                      setFormData({ type: "default", id: "" });
                    },
                    onError(error) {
                      setFormData({ type: "default", id: "" });
                    },
                  }
                );
              }}
              disabled={isPendingDeleteChecklist}
            >
              {isPendingDeleteChecklist ? "Loading..." : "Confirm"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        open={formData.type == "update"}
        onOpenChange={() => setFormData({ type: "default", id: "" })}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto w-full lg:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-left">Update Checklist</DialogTitle>
          </DialogHeader>
          <ChecklistForm
            onSubmitForDialogAndRefetch={async () => {
              await refetch();
              setFormData({ type: "default", id: "" });
            }}
            formData={formData}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
