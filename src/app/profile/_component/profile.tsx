"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import IconEdit from "@/assets/IconEdit";
import IconLayingBaby from "@/assets/IconLayingBaby";
import IconPlus from "@/assets/IconPlus";
import { AppDialog } from "@/components/base/AppDialog";
import { CircleIcon } from "@/components/ui/CircleIcon";
import { CheckLine, Trash2 } from "lucide-react";
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
        <div className="flex max-w-[1200px] w-full mx-auto bg-soft-white rounded-2xl p-6 lg:p-8 justify-center items-center min-h-[400px]">
          <p className="text-xl text-popover-foreground">
            Please login to view your profile
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 pt-10 lg:py-20">
      <div className="flex max-w-5xl w-full mx-auto bg-soft-white rounded-2xl p-6 lg:p-8 flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Left Section */}
        <div className="flex-1 w-full lg:max-w-1/2 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center">
            <div className="relative">
              <CircleIcon className="w-[90px] h-[90px] lg:w-[158px] lg:h-[158px] relative overflow-hidden">
                {avatarPreview || user?.avatar ? (
                  <Image
                    src={avatarPreview || user?.avatar}
                    alt={user?.name || "User"}
                    fill
                    className="object-cover"
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
                className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary/90 transition shadow-lg"
                title="Upload Avatar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 lg:h-5 lg:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
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
            <p className="lg:text-4xl text-3xl text-wrap  max-w-full font-medium  text-popover-foreground text-center lg:text-left uppercase">
              {user.name || "Guest User"}
            </p>
          </div>

          <div className="flex flex-col gap-3">
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
                            Are you sure you want to delete. This action cannot
                            be undone.
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
              <p className="text-center text-gray-500">No baby profiles yet</p>
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
    </section>
  );
}
