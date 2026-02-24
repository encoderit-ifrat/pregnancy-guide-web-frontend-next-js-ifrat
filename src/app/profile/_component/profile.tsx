"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import IconPlus from "@/assets/IconPlus";
import { AppDialog } from "@/components/base/AppDialog";
import { CircleIcon } from "@/components/ui/CircleIcon";
import { Pencil, Trash2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import FormProfile from "@/components/Form/FormProfile";
import {
  BasicProfileRequestType,
  useBasicProfileUpdate,
} from "../_api/mutations/useBasicProfileUpdate";
import { useFileUploadTempFolder } from "../_api/mutations/useFileUploadTempFolder";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { BabyProfile, ProfileDetail } from "../_types.ts/profile_types";
import { useBabyDelete } from "../_api/mutations/useBabyDelete";
import { ProfileFormData } from "../_types.ts/profile_form_types";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";
import WaveDivider from "@/components/layout/svg/WaveDivider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import BabyPercentage from "@/app/profile/_component/babyPercentage";
import PartnerInvite from "./PartnerInvite";
import { useTranslation } from "@/providers/I18nProvider";


export const getInitial = (name?: string): string => {
  return name ? name.charAt(0).toUpperCase() : "U";
};

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, isLoading, isAuthenticated, refetch } = useCurrentUser();
  const [babyProfiles, setBabyProfiles] = useState<BabyProfile[]>([]);

  const [profileDetails, setProfileDetails] = useState<ProfileDetail[]>([
    { key: "name", label: t("profile.name"), value: "" },
    { key: "familyName", label: t("profile.familyName"), value: "" },
    { key: "partnerName", label: t("profile.partnerName"), value: "" },
    { key: "email", label: t("profile.email"), value: "" },
  ]);
  const [formData, setFormData] = useState<ProfileFormData>({
    type: "default",
    id: "",
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(2).max(60),
        familyName: z.string().min(2).max(60),
        partnerName: z.string().min(2).max(60),
        email: z.string().email(),
      })
    ),
    defaultValues: {
      name: user?.name || "",
      familyName: user?.details?.family_name || "",
      partnerName: user?.details?.partner_name || "",
      email: user?.email || "",
    },
  });

  // Populate form with user data
  useEffect(() => {
    if (user) {
      const formValues = {
        name: user.name || "",
        familyName: user?.details?.family_name || "",
        partnerName: user?.details?.partner_name || "",
        email: user.email || "",
      };

      form.reset(formValues);
      setProfileDetails([
        {
          key: "name",
          label: t("profile.name"),
          value: user.name || "",
        },
        {
          key: "familyName",
          label: t("profile.familyName"),
          value: user?.details?.family_name || "",
        },
        {
          key: "partnerName",
          label: t("profile.partnerName"),
          value: user?.details?.partner_name || "",
        },
        { key: "email", label: t("profile.email"), value: user.email || "" },
      ]);
      setPendingAvatar(user?.avatar);
      setBabyProfiles(user?.details?.babies || []);
    }
  }, [user]);

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pendingAvatar, setPendingAvatar] = useState<File | null>(null);

  const { mutate: fileUploadTempFolder } = useFileUploadTempFolder();

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }
    fileUploadTempFolder(
      { file },
      {
        onSuccess(data: any) {
          setPendingAvatar(data?.data?.file);
        },
      }
    );
    setHasChanges(true);
    setIsEditing(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const { mutate: updateProfile, isPending: profileUpdatePending } =
    useBasicProfileUpdate();

  const handleSave = async (): Promise<void> => {
    const formValues = form.getValues(); // Get current form values

    if (!hasChanges && !pendingAvatar) {
      setIsEditing(false);
      return;
    }

    try {
      const updatedData: Partial<BasicProfileRequestType> = {
        name: formValues.name,
        dob: user?.dob,
        gender: user?.gender,
        mobile: user?.mobile,
        details: {
          family_name: formValues.familyName,
          partner_name: formValues.partnerName,
          due_date: user?.details?.due_date,
          last_period_date: user?.details?.last_period_date,
        },
      };

      // Add avatar if there's a pending upload
      if (pendingAvatar) {
        updatedData.avatar = pendingAvatar;
      }

      updateProfile(updatedData as BasicProfileRequestType, {
        onSuccess: (response) => {
          setIsEditing(false);
          setHasChanges(false);
          setPendingAvatar(null);
          refetch();
          toast.success(t("profile.updateSuccess"));
        },
        onError: (error) => {
          toast.error(t("profile.updateFailed"));
        },
      });
    } catch (error) {
      toast.error(t("pregnancy.error"));
    }
  };

  const handleCancel = (): void => {
    if (user) {
      setProfileDetails([
        {
          key: "name",
          label: t("profile.name"),
          value: user.name || "",
        },
        {
          key: "familyName",
          label: t("profile.familyName"),
          value: user?.details?.family_name || "",
        },
        {
          key: "partnerName",
          label: t("profile.partnerName"),
          value: user?.details?.partner_name || "",
        },

        { key: "email", label: t("profile.email"), value: user.email || "" },
      ]);
    }
    setAvatarPreview(null);
    setIsEditing(false);
    setHasChanges(false);
  };

  const { mutate: babyDelete, isPending: babyDeletePending } = useBabyDelete();

  if (isLoading) {
    return (
      <section className="w-full px-4 pt-10 lg:py-20">
        <div className="flex max-w-300 w-full mx-auto bg-soft-white rounded-2xl p-6 lg:p-8 justify-center items-center min-h-[400px]">
          <p className="text-xl text-popover-foreground">{t("profile.loading")}</p>
        </div>
      </section>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <section className="w-full px-4 pt-10 lg:py-20">
        <div className="flex section bg-soft-white rounded-2xl p-6 lg:p-8 justify-center items-center min-h-[400px]">
          <p className="text-xl text-popover-foreground">
            {t("profile.loginRequired")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-6">
      <div className="relative bg-[#F6F0FF] pt-2">
        <div className="relative z-20 px-4 max-w-7xl mx-auto w-full h-52 lg:h-42 mb-30! lg:mb-auto">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center transform translate-y-[10px] md:translate-y-[40px]">
            <div className="relative">
              <CircleIcon className="size-42 lg:size-48 relative overflow-hidden shadow-xl">
                {avatarPreview || user?.avatar ? (
                  <Image
                    src={avatarPreview || user?.avatar}
                    alt={user?.name || "User"}
                    fill
                    className="object-cover rounded-full border-8 border-primary"
                    sizes="(max-width: 1024px) 180px, 158px"
                  />
                ) : (
                  <span className="text-3xl lg:text-6xl font-bold text-popover-foreground">
                    {getInitial(user?.name)}
                  </span>
                )}
              </CircleIcon>

              {/* Avatar Upload Button */}
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-[10px] right-[10px] bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary/90 transition shadow-lg"
                title="Upload Avatar"
              >
                {/*<Camera size={20} />*/}
                <svg
                  width="23"
                  height="21"
                  viewBox="0 0 23 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.5844 3.6859C17.63 3.76554 17.7097 3.82242 17.8122 3.82242C20.5456 3.82242 22.7778 6.05217 22.7778 8.78246V15.54C22.7778 18.2703 20.5456 20.5 17.8122 20.5H4.96556C2.22083 20.5 0 18.2703 0 15.54V8.78246C0 6.05217 2.22083 3.82242 4.96556 3.82242C5.05667 3.82242 5.14778 3.77691 5.18194 3.6859L5.25028 3.54939C5.28954 3.46676 5.32983 3.38188 5.37074 3.29573C5.66209 2.68203 5.98443 2.00308 6.18417 1.60405C6.70806 0.580189 7.59639 0.0113762 8.70111 0H14.0653C15.17 0.0113762 16.0697 0.580189 16.5936 1.60405C16.773 1.96243 17.0463 2.53972 17.3097 3.09611C17.3641 3.21087 17.418 3.32475 17.4706 3.43563L17.5844 3.6859ZM16.7531 8.05438C16.7531 8.6232 17.2086 9.07825 17.7781 9.07825C18.3475 9.07825 18.8144 8.6232 18.8144 8.05438C18.8144 7.48557 18.3475 7.01915 17.7781 7.01915C17.2086 7.01915 16.7531 7.48557 16.7531 8.05438ZM9.41861 9.8177C9.95389 9.28302 10.6486 8.99861 11.3889 8.99861C12.1292 8.99861 12.8239 9.28302 13.3478 9.80633C13.8717 10.3296 14.1564 11.0236 14.1564 11.763C14.145 13.2875 12.915 14.5275 11.3889 14.5275C10.6486 14.5275 9.95389 14.2431 9.43 13.7198C8.90611 13.1964 8.62139 12.5025 8.62139 11.763V11.7517C8.61 11.035 8.89472 10.341 9.41861 9.8177ZM14.5436 14.9256C13.735 15.7334 12.6189 16.2339 11.3889 16.2339C10.1931 16.2339 9.07694 15.7675 8.22278 14.9256C7.38 14.0724 6.91306 12.9575 6.91306 11.763C6.90167 10.5799 7.36861 9.46504 8.21139 8.61182C9.06556 7.7586 10.1931 7.29218 11.3889 7.29218C12.5847 7.29218 13.7122 7.7586 14.555 8.60044C15.3978 9.45366 15.8647 10.5799 15.8647 11.763C15.8533 13.0031 15.3522 14.1179 14.5436 14.9256Z"
                    fill="white"
                  />
                </svg>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div className="block lg:hidden text-center">
              <p className="text-3xl text-wrap max-w-full font-medium lg:text-left mb-2">
                {user.name || t("profile.guestUser")}
              </p>
              <p>{t("profile.accountReady")}</p>
            </div>
          </div>
        </div>

        <WaveDivider
          className="absolute bottom-0 z-10 text-white transform translate-y-px"
          bgClassName="bg-[#F6F0FF]"
        />
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 mt-20">
        <div className="mb-8 md:mb-12">
          <PartnerInvite />
        </div>
        <div className="flex items-center justify-between mb-6 md:mb-20">

          <h4 className="text-primary-dark text-3xl font-semibold">
            {t("profile.editProfile")}
          </h4>
          {user?.updatedAt && (
            <p className="hidden lg:block">
              {t("profile.lastUpdated", { date: new Date(user?.updatedAt).toLocaleDateString() })}
            </p>
          )}
        </div>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-18">
          {/* Left Section */}
          <div className="flex-1 w-full lg:max-w-1/2 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <p className="hidden lg:block text-3xl text-wrap max-w-full font-medium text-center lg:text-left">
                {user.name || t("profile.guestUser")}
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSave)}>
                  {profileDetails.map((item, id) => (
                    <div key={id} className="mb-2">
                      <FormField
                        control={form.control}
                        name={
                          item.key as
                          | "name"
                          | "familyName"
                          | "partnerName"
                          | "email"
                        } // Fix: use the actual field name
                        render={({ field }) => (
                          <FormItem className="mb-3 sm:mb-4 lg:mb-2">
                            <FormControl>
                              <div className="relative">
                                <Input
                                  label={item.label}
                                  {...field}
                                  disabled={item.key === "email"}
                                  onChange={(e) => {
                                    field.onChange(e); // Update form state
                                    setHasChanges(true); // Track changes
                                    setIsEditing(true);
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="pl-8 sm:pl-9 md:pl-10 text-xs sm:text-sm" />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </form>
              </Form>
            </div>

            {isEditing && hasChanges && (
              <div className="flex gap-4">
                <Button
                  onClick={handleSave}
                  isLoading={profileUpdatePending}
                  className="flex-1 bg-primary text-white py-3 rounded-full hover:bg-primary/90 transition"
                >
                  {t("profile.saveChanges")}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant={"purple"}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-full hover:bg-gray-400 transition"
                >
                  {t("profile.cancelAll")}
                </Button>
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className="flex-1 w-full lg:max-w-1/2 flex flex-col gap-6 text-popover-foreground">
            <h4 className="text-3xl text-wrap max-w-full font-medium text-left">
              {t("profile.myProfiles")}
            </h4>

            <div className="flex flex-col gap-4">
              {babyProfiles.length > 0 ? (
                babyProfiles.map((profile, index) => (
                  <div
                    key={index}
                    className="bg-white transition px-4 rounded-lg shadow-xl shadow-primary-light"
                  >
                    <div className="flex flex-wrap items-center justify-center gap-2 py-6">
                      <BabyPercentage
                        percentage={
                          user?.details?.current_pregnancy_data?.percentage || 0
                        }
                        profile={profile}
                      />

                      <div className="mx-auto text-center lg:text-left">
                        <p className="text-lg lg:text-2xl">{t("profile.pregnant")}</p>
                        <p className="text-lg lg:text-2xl mb-4">
                          <span className="text-primary">
                            {profile.upcoming ? t("profile.beenPregnant") : profile.name}
                          </span>
                          :
                          {profile.upcoming
                            ? `${user?.details?.current_pregnancy_data?.week || 0
                            } ${t("pregnancy.weeks")} ${user?.details?.current_pregnancy_data?.day || 0
                            } ${t("pregnancy.days")}`
                            : t("profile.newborn")}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center justify-center lg:justify-start gap-2">
                          {/* Edit Baby Profile */}
                          <AppDialog
                            title="Edit Baby Profile"
                            customTrigger={
                              <button className="px-4 py-2 bg-primary-light rounded-sm flex items-center">
                                <Pencil className="size-4 md:size-4 cursor-pointer mr-2" />
                                <span className="text-sm">{t("profile.edit")}</span>
                              </button>
                            }
                          >
                            {(close) => (
                              <FormProfile
                                initialData={profile}
                                onSubmitForDialogAndRefetch={async () => {
                                  await refetch();
                                  close();
                                }}
                              />
                            )}
                          </AppDialog>

                          {/* Delete Baby Profile */}
                          <button
                            className="px-4 py-2 bg-primary-light rounded-sm flex items-center"
                            onClick={() => {
                              setFormData({ type: "delete", id: profile._id });
                            }}
                          >
                            <Trash2 className="size-4 cursor-pointer mr-2" />
                            <span className="text-sm">{t("profile.delete")}</span>
                          </button>
                        </div>
                        <AlertDialog
                          open={formData.type == "delete"}
                          onOpenChange={() =>
                            setFormData({ type: "default", id: "" })
                          }
                        >
                          {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {t("profile.deleteConfirmTitle")}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {t("profile.deleteConfirmDesc")}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <Button
                                onClick={() => {
                                  babyDelete(
                                    { id: formData.id },
                                    {
                                      onSuccess: async (data) => {
                                        await refetch();
                                        toast.success(
                                          data?.data?.message ||
                                          t("profile.deleteSuccess")
                                        );
                                        setFormData({
                                          type: "default",
                                          id: "",
                                        });
                                      },

                                      onError(error) {
                                        setFormData({
                                          type: "default",
                                          id: "",
                                        });
                                      },
                                    }
                                  );
                                }}
                                disabled={babyDeletePending}
                              >
                                {babyDeletePending ? t("checklists.loading") : t("common.confirm")}
                              </Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  {t("profile.noProfiles")}
                </p>
              )}

              {/* Add Baby Profile (Hidden if last_period_date exists) */}
              {!user?.details?.last_period_date && (
                <AppDialog
                  title={t("profile.addBabyProfile")}
                  customTrigger={
                    <div className="flex items-center border bg-light border-gray rounded-full px-4 py-2 cursor-pointer hover:bg-purple-50 transition w-full">
                      <div className="flex-1 flex justify-center lg:justify-start">
                        <CircleIcon className="size-12 md:size-22 text-popover-foreground flex items-center justify-center p-3">
                          <IconPlus className="size-full" />
                        </CircleIcon>
                      </div>
                      <div className="justify-center lg:justify-start w-full xs:w-auto">
                        <span className="lg:text-xl sm:text-xs text-text-dark pl-5">
                          {t("profile.addBabyProfile")}
                        </span>
                      </div>
                    </div>
                  }
                >
                  {(close) => (
                    <FormProfile
                      initialData={null}
                      onSubmitForDialogAndRefetch={async () => {
                        await refetch();
                        close();
                      }}
                    />
                  )}
                </AppDialog>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
