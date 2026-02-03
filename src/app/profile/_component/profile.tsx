"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import IconEdit from "@/assets/IconEdit";
import IconLayingBaby from "@/assets/IconLayingBaby";
import IconPlus from "@/assets/IconPlus";
import { AppDialog } from "@/components/base/AppDialog";
import { CircleIcon } from "@/components/ui/CircleIcon";
import { Camera, CheckLine, Trash2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import FormProfile from "@/components/Form/FormProfile";
import {
  BasicProfileRequestType,
  useBasicProfileUpdate,
} from "../_api/mutations/useBasicProfileUpdate";
import { useFileUploadTempFolder } from "../_api/mutations/useFileUploadTempFolder";
import { API_BASE_URL } from "@/consts";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { BabyProfile, ProfileDetail } from "../_types.ts/profile_types";
import { DeleteConfirmDialog } from "@/components/base/DeleteConfirmDialog";
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
import { HeroSection2 } from "@/components/home/HeroSection2";
import WaveDivider from "@/components/layout/svg/WaveDivider";
export const getInitial = (name?: string): string => {
  return name ? name.charAt(0).toUpperCase() : "U";
};

export default function ProfilePage() {
  const { user, isLoading, isAuthenticated, refetch } = useCurrentUser();
  const [babyProfiles, setBabyProfiles] = useState<BabyProfile[]>([]);

  const [profileDetails, setProfileDetails] = useState<ProfileDetail[]>([
    { key: "name", label: "NAME", value: "" },
    { key: "familyName", label: "FAMILY NAME", value: "" },
    { key: "partnerName", label: "PARTNER NAME", value: "" },
    { key: "email", label: "EMAIL", value: "" },
  ]);
  const [formData, setFormData] = useState<ProfileFormData>({
    type: "default",
    id: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setProfileDetails([
        {
          key: "name",
          label: "NAME",
          value: user.name || "",
        },
        {
          key: "familyName",
          label: "FAMILY NAME",
          value: user?.details?.family_name || "",
        },
        {
          key: "partnerName",
          label: "PARTNER NAME",
          value: user?.details?.partner_name || "",
        },

        { key: "email", label: "EMAIL", value: user.email || "" },
      ]);
      setPendingAvatar(user?.avatar);
      setBabyProfiles(user?.details?.babies || []);
    }
  }, [user]);

  const handleChange = (id: number, newValue: string): void => {
    const newDetails = [...profileDetails];
    newDetails[id].value = newValue;
    setProfileDetails(newDetails);
    setHasChanges(true);
  };

  const handleEditToggle = (id: number): void => {
    if (editingIndex === id) {
      setEditingIndex(null);
    } else {
      setEditingIndex(id);
      setIsEditing(true);
    }
  };

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
    if (!hasChanges && !pendingAvatar) {
      setEditingIndex(null);
      setIsEditing(false);
      return;
    }
    try {
      // Prepare profile data
      const updatedData: Partial<BasicProfileRequestType> = {};
      profileDetails.forEach((item) => {
        updatedData.details = updatedData.details ?? {};
        if (item.key === "name") {
          updatedData.name = item.value;
        }
        if (item.key === "familyName") {
          updatedData.details.family_name = item.value;
        }

        if (item.key === "partnerName") {
          updatedData.details.partner_name = item.value;
        }
        updatedData.dob = user?.dob;
        updatedData.gender = user?.gender;
        updatedData.mobile = user?.mobile;
        ((updatedData.details.due_date = user?.details?.due_date),
          (updatedData.details.last_period_date =
            user?.details?.last_period_date));
      });

      // Add avatar if there's a pending upload
      if (pendingAvatar) {
        updatedData.avatar = pendingAvatar;
      }

      updateProfile(updatedData as BasicProfileRequestType, {
        onSuccess: (response) => {
          setEditingIndex(null);
          setIsEditing(false);
          setHasChanges(false);
          setPendingAvatar(null);
          refetch();
          toast.success("Profile updated successfully");
        },
        onError: (error) => {},
      });
    } catch (error) {}
  };

  const handleCancel = (): void => {
    if (user) {
      setProfileDetails([
        {
          key: "name",
          label: "NAME",
          value: user.name || "",
        },
        {
          key: "familyName",
          label: "FAMILY NAME",
          value: user?.details?.family_name || "",
        },
        {
          key: "partnerName",
          label: "PARTNER NAME",
          value: user?.details?.partner_name || "",
        },

        { key: "email", label: "EMAIL", value: user.email || "" },
      ]);
    }
    setAvatarPreview(null);
    setEditingIndex(null);
    setIsEditing(false);
    setHasChanges(false);
  };

  const { mutate: babyDelete, isPending: babyDeletePending } = useBabyDelete();

  if (isLoading) {
    return (
      <section className="w-full px-4 pt-10 lg:py-20">
        <div className="flex max-w-[1200px] w-full mx-auto bg-soft-white rounded-2xl p-6 lg:p-8 justify-center items-center min-h-[400px]">
          <p className="text-xl text-popover-foreground">Loading profile...</p>
        </div>
      </section>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <section className="w-full px-4 pt-10 lg:py-20">
        <div className="flex section bg-soft-white rounded-2xl p-6 lg:p-8 justify-center items-center min-h-[400px]">
          <p className="text-xl text-popover-foreground">
            Please login to view your profile
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-svh">
      <div className="relative bg-[#F6F0FF] pt-2">
        <div className="relative z-20 px-4 max-w-6xl mx-auto w-full h-42">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center transform translate-y-[10px] md:translate-y-[40px]">
            <div className="relative">
              <CircleIcon className="w-[90px] h-[90px] lg:w-[158px] lg:h-[158px] relative overflow-hidden">
                {avatarPreview || user?.avatar ? (
                  <Image
                    src={avatarPreview || user?.avatar}
                    alt={user?.name || "User"}
                    fill
                    className="object-cover rounded-full border-8 border-primary"
                    sizes="(max-width: 1024px) 90px, 158px"
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
                    fill-rule="evenodd"
                    clip-rule="evenodd"
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
          </div>
        </div>

        <WaveDivider
          className="absolute bottom-0 z-10 text-white transform translate-y-[1px]"
          bgClassName="bg-[#F6F0FF]"
        />
      </div>

      <div className="max-w-6xl w-full mx-auto mt-20">
        <h4 className="text-primary-dark text-2xl font-semibold">
          Edit profile
        </h4>
        <div className="flex w-full  mx-auto bg-soft-white rounded-2xl p-6 lg:p-8 flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Left Section */}
          <div className="flex-1 w-full lg:max-w-1/2 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-3xl text-wrap  max-w-full font-medium  text-popover-foreground text-center lg:text-left uppercase">
                {user.name || "Guest User"}
              </p>
              {profileDetails.map((item, id) => (
                <div
                  key={id}
                  className="flex text-popover-foreground justify-between items-center bg-light hover:bg-purple-50 transition px-4 rounded-full"
                >
                  <span className="text-xs lg:text-lg whitespace-nowrap">
                    {item.label}:
                  </span>
                  <input
                    value={item.value}
                    onChange={(e) => handleChange(id, e.target.value)}
                    disabled={editingIndex !== id}
                    className={`outline-none shadow-none text-xs lg:text-xl w-full bg-transparent h-18 px-2
                    ${
                      editingIndex === id
                        ? "bg-soft-white cursor-text"
                        : "cursor-default"
                    }`}
                  />
                  {item.key == "email" ? null : editingIndex === id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="hover:opacity-70 transition"
                        title="Save"
                      >
                        <CheckLine size={20} />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-red-600 hover:text-red-700"
                        title="Cancel"
                      >
                        <span className="text-xl">×</span>
                      </button>
                    </div>
                  ) : (
                    // <button onClick={() => handleEditToggle(id)} title="Edit">
                    <IconEdit
                      onClick={() => handleEditToggle(id)}
                      className="size-4 shrink-0"
                    />
                    // </button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && hasChanges && (
              <div className="flex gap-4">
                <Button
                  variant={"softPurple"}
                  onClick={handleSave}
                  isLoading={profileUpdatePending}
                  className="flex-1 bg-primary text-white py-3 rounded-full hover:bg-primary/90 transition"
                >
                  Save All Changes
                </Button>
                <Button
                  onClick={handleCancel}
                  variant={"purple"}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-full hover:bg-gray-400 transition"
                >
                  Cancel All
                </Button>
              </div>
            )}
          </div>

          <div className="hidden lg:block w-px bg-muted-gray"></div>

          {/* Right Section */}
          <div className="flex-1 w-full lg:max-w-1/2 flex flex-col gap-6 text-popover-foreground">
            <h2 className="lg:text-4xl text-3xl font-medium text-center lg:text-left">
              MY PROFILES
            </h2>

            <div className="flex flex-col gap-4">
              {babyProfiles.length > 0 ? (
                babyProfiles.map((profile, index) => (
                  <div
                    key={index}
                    className="flex text-popover-foreground justify-between items-center bg-light hover:bg-purple-50 transition px-4 rounded-full"
                  >
                    <div className="flex items-center gap-5 py-2">
                      <CircleIcon className="size-12 md:size-22 relative overflow-hidden">
                        {profile.upcoming ? (
                          <IconLayingBaby />
                        ) : profile.avatar ? (
                          <Image
                            src={profile.avatar}
                            alt={profile.name || "Baby"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-3xl font-bold text-popover-foreground">
                            {getInitial(profile.name)}
                          </span>
                        )}
                      </CircleIcon>

                      <div className="text-text-dark">
                        <p className="text-lg lg:text-2xl uppercase">
                          {profile.upcoming ? "Pregnant" : profile.name}
                        </p>
                        <p className="text-sm">
                          {profile.upcoming
                            ? `${
                                user?.details?.current_pregnancy_data?.week || 0
                              } week ${
                                user?.details?.current_pregnancy_data?.day || 0
                              } days`
                            : "Newborn"}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* Edit Baby Profile */}
                      <AppDialog
                        title="Edit Baby Profile"
                        customTrigger={
                          <IconEdit className="size-4 md:size-6 cursor-pointer" />
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
                      <Trash2
                        className="size-4 md:size-6 cursor-pointer hover:opacity-70 hover:text-red-500 transition"
                        onClick={() => {
                          setFormData({ type: "delete", id: profile._id });
                        }}
                      />
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
                              Delete Baby Profile
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete. This action
                              cannot be undone.
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
                                          "Profile deleted successfully"
                                      );
                                      setFormData({ type: "default", id: "" });
                                    },

                                    onError(error) {
                                      setFormData({ type: "default", id: "" });
                                    },
                                  }
                                );
                              }}
                              disabled={babyDeletePending}
                            >
                              {babyDeletePending ? "Loading..." : "Confirm"}
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No baby profiles yet
                </p>
              )}

              {/* Add Baby Profile (Hidden if last_period_date exists) */}
              {!user?.details?.last_period_date && (
                <AppDialog
                  title="Add Baby Profile"
                  customTrigger={
                    <div className="flex items-center border bg-light border-gray rounded-full px-4 py-2 cursor-pointer hover:bg-purple-50 transition w-full">
                      <div className="flex-1 flex justify-center lg:justify-start">
                        <CircleIcon className="size-12 md:size-22 text-popover-foreground flex items-center justify-center p-3">
                          <IconPlus className="size-full" />
                        </CircleIcon>
                      </div>
                      <div className="justify-center lg:justify-start w-full xs:w-auto">
                        <span className="lg:text-xl sm:text-xs text-text-dark pl-5">
                          Add Baby Profile
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
